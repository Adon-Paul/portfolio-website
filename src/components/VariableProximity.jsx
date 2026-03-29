import { forwardRef, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import './VariableProximity.css';

const GlobalMouseScheduler = (() => {
  const subscribers = new Set();
  let rafId = null;
  let listening = false;
  let mouseX = 0;
  let mouseY = 0;

  const schedule = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      subscribers.forEach((cb) => cb(mouseX, mouseY));
    });
  };

  const onMouseMove = (ev) => {
    mouseX = ev.clientX;
    mouseY = ev.clientY;
    schedule();
  };

  const onTouchMove = (ev) => {
    const touch = ev.touches?.[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    schedule();
  };

  const ensureListeners = () => {
    if (listening) return;
    listening = true;
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
  };

  const teardownIfUnused = () => {
    if (subscribers.size !== 0) return;
    if (!listening) return;
    listening = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const subscribe = (cb) => {
    subscribers.add(cb);
    ensureListeners();
    return () => {
      subscribers.delete(cb);
      teardownIfUnused();
    };
  };

  return { subscribe };
})();

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    enabled = true,
    a11yMode = 'aria-label',
    ...restProps
  } = props;

  if (!enabled) {
    return (
      <span ref={ref} className={className} onClick={onClick} style={style} {...restProps}>
        {label}
      </span>
    );
  }

  const letterRefs = useRef([]);
  const rootRef = useRef(null);
  const interpolatedSettingsRef = useRef([]);
  const lastPositionRef = useRef({ x: null, y: null });
  const cachedRectsRef = useRef([]);
  const containerRectRef = useRef(null);
  const rectsDirtyRef = useRef(true);
  const [isInView, setIsInView] = useState(true);

  const setCombinedRef = useCallback((node) => {
    rootRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
      return;
    }
    if (ref && typeof ref === 'object') {
      ref.current = node;
    }
  }, [ref]);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr) =>
      new Map(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const [name, value] = s.split(' ');
            return [name.replace(/['\"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (!rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  // Invalidate cached rects on resize/scroll
  useEffect(() => {
    if (!enabled || !isInView) return;
    const invalidate = () => { rectsDirtyRef.current = true; };
    window.addEventListener('resize', invalidate);
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
    };
  }, [enabled, isInView]);

  useEffect(() => {
    if (!enabled || !isInView) return;

    const recalcRects = () => {
      if (!containerRef?.current) return;
      containerRectRef.current = containerRef.current.getBoundingClientRect();
      cachedRectsRef.current = letterRefs.current.map(el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          centerX: r.left + r.width / 2 - containerRectRef.current.left,
          centerY: r.top + r.height / 2 - containerRectRef.current.top,
        };
      });
      rectsDirtyRef.current = false;
    };

    const update = (globalX, globalY) => {
      if (!containerRef?.current) return;

      if (rectsDirtyRef.current) recalcRects();

      const cRect = containerRectRef.current;
      if (!cRect) return;
      const x = globalX - cRect.left;
      const y = globalY - cRect.top;

      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
        return;
      }
      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;
        const cached = cachedRectsRef.current[index];
        if (!cached) return;

        const distance = calculateDistance(x, y, cached.centerX, cached.centerY);

        if (distance >= radius) {
          letterRef.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        const falloffValue = calculateFalloff(distance);
        const newSettings = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
            return `'${axis}' ${interpolatedValue}`;
          })
          .join(', ');

        interpolatedSettingsRef.current[index] = newSettings;
        letterRef.style.fontVariationSettings = newSettings;
      });
    };

    return GlobalMouseScheduler.subscribe(update);
  }, [
    enabled,
    isInView,
    containerRef,
    radius,
    falloff,
    fromFontVariationSettings,
    parsedSettings,
  ]);

  const words = String(label).split(' ');
  let letterIndex = 0;

  const a11yProps =
    a11yMode === 'aria-label'
      ? { 'aria-label': label }
      : a11yMode === 'both'
        ? { 'aria-label': label }
        : undefined;

  return (
    <span
      ref={setCombinedRef}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...a11yProps}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}

      {a11yMode === 'both' && <span className="sr-only">{label}</span>}
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
