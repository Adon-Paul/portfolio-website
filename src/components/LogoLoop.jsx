import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'
import '../styles/components/LogoLoop.css'

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined))

const useResizeObserver = (callback, elements = [], dependencies = []) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback()
      window.addEventListener('resize', handleResize)
      callback()
      return () => window.removeEventListener('resize', handleResize)
    }
    const observers = elements.map(ref => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })
    callback()
    return () => { observers.forEach(observer => observer?.disconnect()) }
  }, [callback, ...elements, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps
}

const useImageLoader = (seqRef, onLoad, dependencies = []) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? []
    if (images.length === 0) { onLoad(); return }
    let remaining = images.length
    const handleLoad = () => { if (--remaining === 0) onLoad() }
    images.forEach(img => {
      if (img.complete) { handleLoad() }
      else {
        img.addEventListener('load', handleLoad, { once: true })
        img.addEventListener('error', handleLoad, { once: true })
      }
    })
    return () => { images.forEach(img => { img.removeEventListener('load', handleLoad); img.removeEventListener('error', handleLoad) }) }
  }, [onLoad, seqRef, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps
}

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, paused) => {
  const rafRef = useRef(null)
  const lastTimestampRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const seqSize = isVertical ? seqHeight : seqWidth
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`
    }
    const animate = timestamp => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp
      const target = paused ? 0 : (isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity)
      const ease = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * ease
      if (seqSize > 0) {
        let next = offsetRef.current + velocityRef.current * deltaTime
        next = ((next % seqSize) + seqSize) % seqSize
        offsetRef.current = next
        track.style.transform = isVertical
          ? `translate3d(0, ${-next}px, 0)`
          : `translate3d(${-next}px, 0, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
      lastTimestampRef.current = null
    }
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef, paused])
}

export const LogoLoop = memo(({
  logos,
  speed = 80,
  direction = 'left',
  width = '100%',
  logoHeight = 32,
  gap = 40,
  pauseOnHover = true,
  hoverSpeed,
  fadeOut = true,
  fadeOutColor,
  scaleOnHover = true,
  renderItem,
  ariaLabel = 'Tech stack logos',
  className,
  style,
  reduceMotion = false,
}) => {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const seqRef = useRef(null)

  const [seqWidth, setSeqWidth] = useState(0)
  const [seqHeight, setSeqHeight] = useState(0)
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const isVertical = direction === 'up' || direction === 'down'

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed
    if (pauseOnHover === true) return 0
    if (pauseOnHover === false) return undefined
    return 0
  }, [hoverSpeed, pauseOnHover])

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed)
    const dir = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1)
    return mag * dir * (speed < 0 ? -1 : 1)
  }, [speed, direction, isVertical])

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const rect = seqRef.current?.getBoundingClientRect?.()
    const sw = rect?.width ?? 0
    const sh = rect?.height ?? 0
    if (isVertical) {
      const ph = containerRef.current?.parentElement?.clientHeight ?? 0
      if (containerRef.current && ph > 0) {
        const th = Math.ceil(ph)
        if (containerRef.current.style.height !== `${th}px`) containerRef.current.style.height = `${th}px`
      }
      if (sh > 0) {
        setSeqHeight(Math.ceil(sh))
        const vp = containerRef.current?.clientHeight ?? ph ?? sh
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(vp / sh) + ANIMATION_CONFIG.COPY_HEADROOM))
      }
    } else if (sw > 0) {
      setSeqWidth(Math.ceil(sw))
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sw) + ANIMATION_CONFIG.COPY_HEADROOM))
    }
  }, [isVertical])

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical])
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical])
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical, reduceMotion)

  const cssVariables = useMemo(() => ({
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
  }), [gap, logoHeight, fadeOutColor])

  const rootClassName = useMemo(() =>
    ['logoloop',
      isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
      fadeOut && 'logoloop--fade',
      scaleOnHover && 'logoloop--scale-hover',
      className
    ].filter(Boolean).join(' '),
    [isVertical, fadeOut, scaleOnHover, className]
  )

  const handleMouseEnter = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(true) }, [effectiveHoverSpeed])
  const handleMouseLeave = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(false) }, [effectiveHoverSpeed])

  const renderLogoItem = useCallback((item, key) => {
    if (renderItem) return <li className="logoloop__item" key={key} role="listitem">{renderItem(item, key)}</li>
    const isNode = 'node' in item
    const content = isNode
      ? <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>{item.node}</span>
      : <img src={item.src} srcSet={item.srcSet} sizes={item.sizes} width={item.width} height={item.height}
          alt={item.alt ?? ''} title={item.title} loading="lazy" decoding="async" draggable={false} />
    const label = isNode ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title)
    const inner = item.href
      ? <a className="logoloop__link" href={item.href} aria-label={label || 'logo link'} target="_blank" rel="noreferrer noopener">{content}</a>
      : content
    return <li className="logoloop__item" key={key} role="listitem">{inner}</li>
  }, [renderItem])

  const logoLists = useMemo(() =>
    Array.from({ length: copyCount }, (_, ci) => (
      <ul className="logoloop__list" key={`copy-${ci}`} role="list" aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
        {logos.map((item, ii) => renderLogoItem(item, `${ci}-${ii}`))}
      </ul>
    )),
    [copyCount, logos, renderLogoItem]
  )

  const containerStyle = useMemo(() => ({
    width: isVertical
      ? toCssLength(width) === '100%' ? undefined : toCssLength(width)
      : (toCssLength(width) ?? '100%'),
    ...cssVariables,
    ...style
  }), [width, cssVariables, style, isVertical])

  return (
    <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
      <div className="logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {logoLists}
      </div>
    </div>
  )
})

LogoLoop.displayName = 'LogoLoop'
export default LogoLoop
