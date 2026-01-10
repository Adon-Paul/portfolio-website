import { forwardRef, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
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
    window.addEventListener('mousemove', onMouseMove);
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
  const interpolatedSettingsRef = useRef([]);
  const lastPositionRef = useRef({ x: null, y: null });

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

    const update = (globalX, globalY) => {
      if (!containerRef?.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = globalX - containerRect.left;
      const y = globalY - containerRect.top;

      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
        return;
      }
      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

        const distance = calculateDistance(x, y, letterCenterX, letterCenterY);

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
      ref={ref}
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
              <motion.span
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
              </motion.span>
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
