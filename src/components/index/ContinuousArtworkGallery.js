import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SkeletonImage from '../SkeletonImage';
import {
  getCentralArtworkId,
  getNextGalleryOffset,
  getPointerParallaxOffset,
  getWheelDelta
} from '../../utils/indexPrototypeLogic';

const MOBILE_QUERY = '(max-width: 768px), (hover: none) and (pointer: coarse)';

const GalleryRoot = styled.section`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const GalleryViewport = styled.div`
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  height: 63%;
  overflow: hidden;
  perspective: ${props => props.$mobile ? 'none' : '1200px'};
  perspective-origin: 50% 50%;
  pointer-events: ${props => props.$mobile ? 'auto' : 'none'};
  outline: none;
  touch-action: pan-y;
  cursor: ${props => (props.$enabled ? 'grab' : 'default')};
  overscroll-behavior: contain;

  &:active {
    cursor: ${props => (props.$enabled ? 'grabbing' : 'default')};
  }
`;

const GalleryPlane = styled.div`
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  pointer-events: none;
  transform: rotateY(var(--pointer-tilt-y, 0deg));
`;

const BackButton = styled.button`
  position: absolute;
  z-index: 3;
  left: var(--back-left, 75%);
  top: 46.5%;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--site-button, #000);
  color: var(--site-button-text, #fff);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  transform: translateY(-50%) translateX(${props => props.$visible ? '0' : '16px'}) scale(${props => props.$visible ? 1 : 0.85});
  transition: opacity 300ms ease, transform 420ms cubic-bezier(.2,.8,.2,1), width 300ms ease, background 300ms ease, visibility 300ms;
  svg { width: 20px; height: 20px; margin: 0 12px; flex-shrink: 0; }
  span {
    font: 500 18px 'Pretendard Variable', sans-serif;
    white-space: nowrap;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &:hover, &:focus-visible { width: 150px; background: #083e2c; color: #fff; }
  &:hover span, &:focus-visible span { opacity: 1; }
  &:focus-visible { outline: 2px solid #083e2c; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) { transition: none; span { transition: none; } }
`;

const GalleryTrack = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  transform-style: preserve-3d;
  height: 100%;
  gap: 20px;
  padding-left: var(--start-padding, 0px);
  padding-right: var(--end-padding, 0px);
  will-change: transform;

`;

const ArtworkCard = styled.button`
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  pointer-events: auto;
  transform: translate3d(var(--pointer-offset-x, 0px), var(--pointer-offset-y, 0px), 0);
  will-change: transform;
  &:focus-visible { outline: 2px solid #2050CA; outline-offset: 5px; }
`;

const ArtworkImage = styled(SkeletonImage)`
  display: block;
  pointer-events: auto;
  max-width: none;
  width: auto;
  height: min(44.8vh, 448px);
  object-fit: contain;
  filter: grayscale(${props => (props.$color ? 0 : 1)});
  opacity: ${props => (props.$color ? 1 : 0.55)};
  transform: scale(${props => props.$hovered ? props.$hoverScale : 1});
  transform-origin: center;
  transition: transform ${props => props.$hoverDuration}ms ease,
    filter 350ms ease, opacity 350ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  @media (max-width: 768px) {
    height: min(32vh, 320px);
  }
`;

const ImageFallback = styled.div`
  width: min(44.8vh, 448px);
  height: min(44.8vh, 448px);
  display: grid;
  place-items: center;
  background: var(--site-skeleton, #f0efec);
  color: #76736e;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  @media (max-width: 768px) {
    width: min(32vh, 320px);
    height: min(32vh, 320px);
  }
`;

const splitLetters = text => typeof Intl.Segmenter === 'function'
  ? Array.from(new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(text), part => part.segment)
  : Array.from(text);
const captionText = artwork => [artwork.title, artwork.year].filter(Boolean).join(' / ');
const letterDelay = length => Math.min(35, 700 / Math.max(1, length - 1));

const ArtworkInfo = styled.div`
  position: absolute;
  left: 4vw;
  right: 4vw;
  top: calc((var(--mobile-image-bottom, calc(46.5% + min(22.4vh, 224px))) + 100% - env(safe-area-inset-bottom, 0px)) / 2);
  transform: translateY(-50%);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: clamp(16px, 3vw, 56px);
  color: #262522;
  font-family: inherit;
  font-size: 80px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.045em;
  pointer-events: none;
`;

const ArtworkName = styled.h2`
  margin: 0;
  min-width: 0;
  font: inherit;
  letter-spacing: inherit;
  white-space: nowrap;
`;

const MobileArtworkInfo = styled(ArtworkInfo)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
  top: calc((var(--mobile-image-bottom, 70%) + 100% - env(safe-area-inset-bottom, 0px)) / 2);
  bottom: auto;
  transform: translateY(-50%);
  font-size: 16px;
  text-align: center;
  h2 { margin: 0; font: inherit; overflow-wrap: anywhere; }
  p { margin: 0; font-size: 16px; letter-spacing: 0; }
`;

const LetterMask = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.2em;
  margin-bottom: -0.2em;
`;

const TitleLetter = styled.span`
  display: inline-block;
  white-space: pre;
  transform: translateY(110%);
  opacity: 0;
`;

const ContinuousArtworkGallery = ({
  artworks,
  enabled,
  sensitivity,
  damping,
  hoverScale,
  hoverDurationMs,
  pointerAreaRef,
  pointerMoveX,
  pointerMoveY,
  pointerTiltY = 0,
  onArtworkOpen,
  showArtworkInfo = true,
  autoFlow = false,
  autoFlowSpeed = 64,
  autoFlowIdleMs = 3000
}) => {
  const viewportRef = useRef(null);
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const maxOffsetRef = useRef(0);
  const animationFrameRef = useRef(null);
  const previousTouchXRef = useRef(null);
  const touchTravelRef = useRef(0);
  const latestPointerRef = useRef(null);
  const pointerFrameRef = useRef(null);
  const [hoveredArtworkId, setHoveredArtworkId] = useState(null);
  const [keyboardArtworkId, setKeyboardArtworkId] = useState(null);
  const keyboardIdRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);
  const returnToStartRef = useRef(null);
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [centeredArtworkId, setCenteredArtworkId] = useState(null);
  const centeredIdRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [caption, setCaption] = useState(null);
  const captionVersionRef = useRef(0);
  const captionElementRef = useRef(null);
  const captionPlaybackRef = useRef({ version: null, time: 0 });

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      setMobile(query.matches);
      setHoveredArtworkId(null);
    };
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener?.('change', updateMotionPreference);

    return () => mediaQuery.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !viewport || !track) return undefined;
    // The page includes the header and all whitespace outside the gallery.
    const pointerArea = pointerAreaRef?.current ?? root;

    const cards = Array.from(track.querySelectorAll('[data-artwork-id]'));
    const leaveKeyboardMode = () => {
      keyboardIdRef.current = null;
      setKeyboardArtworkId(null);
    };
    leaveKeyboardMode();
    const pointerOffsets = cards.map(() => ({ x: 0, y: 0 }));
    let previousPointerTime = null;
    let currentTilt = 0;
    let touchVelocity = 0;
    let lastTouchTime = 0;
    let wheelVelocity = 0;
    let wheelTime = null;
    let returningToStart = false;
    let autoFrame = null;
    let idleTimer = null;
    let autoTime = null;
    let autoAllowed = true;
    let windowActive = !document.hidden;
    const stopAuto = () => {
      if (autoFrame !== null) window.cancelAnimationFrame(autoFrame);
      autoFrame = null;
      autoTime = null;
    };
    const flow = timestamp => {
      autoFrame = null;
      if (!autoFlow || cards.length < 2 || !enabled || reducedMotion || !windowActive || !autoAllowed) return;
      const elapsed = autoTime === null ? 0 : Math.min(64, Math.max(0, timestamp - autoTime));
      autoTime = timestamp;
      if (animationFrameRef.current === null && previousTouchXRef.current === null && !returningToStart) {
        leaveKeyboardMode();
        const next = getNextGalleryOffset(currentOffsetRef.current, elapsed * autoFlowSpeed * (mobile ? 0.5 : 1) / 1000, maxOffsetRef.current);
        targetOffsetRef.current = next;
        renderOffset(next);
        if (maxOffsetRef.current > 0 && next >= maxOffsetRef.current) return;
      }
      autoFrame = window.requestAnimationFrame(flow);
    };
    const startAuto = () => {
      if (autoFlow && cards.length > 1 && enabled && !reducedMotion && windowActive && autoAllowed && autoFrame === null) {
        autoTime = null;
        autoFrame = window.requestAnimationFrame(flow);
      }
    };
    const pauseAuto = () => {
      if (!autoFlow || reducedMotion) return;
      autoAllowed = false;
      stopAuto();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => { autoAllowed = true; startAuto(); }, autoFlowIdleMs);
    };
    const suspendAuto = () => { windowActive = false; stopAuto(); };
    const resumeAuto = () => { windowActive = !document.hidden; startAuto(); };
    const visibilityChanged = () => { if (document.hidden) suspendAuto(); else resumeAuto(); };

    const stopTouchMotion = () => {
      returningToStart = false;
      wheelVelocity = 0;
      wheelTime = null;
      touchVelocity = 0;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      targetOffsetRef.current = currentOffsetRef.current;
    };

    const updateHoverFromPointer = () => {
      if (keyboardIdRef.current !== null) return;
      const point = latestPointerRef.current;
      if (mobile || !enabled || !point || typeof document.elementFromPoint !== 'function') return;
      // Browser hit testing respects the projected quadrilateral and viewport clipping.
      const hit = document.elementFromPoint(point.x, point.y);
      const id = hit?.matches?.('img[data-hover-artwork-id]') && track.contains(hit)
        ? hit.dataset.hoverArtworkId
        : null;
      setHoveredArtworkId(previous => previous === id ? previous : id);
    };

    const renderOffset = offset => {
      currentOffsetRef.current = offset;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      setAtEnd(!returningToStart && enabled && cards.length > 0 && maxOffsetRef.current > 0 && offset >= maxOffsetRef.current - 0.5);
      const last = cards[cards.length - 1];
      if (last) {
        const edge = last.getBoundingClientRect().right - root.getBoundingClientRect().left;
        root.style.setProperty('--back-left', `${Math.max(8, Math.min(root.clientWidth - 158, edge + 28))}px`);
      }
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      if (mobile) {
        const id = enabled ? getCentralArtworkId(
          cards.map(card => ({ id: card.dataset.artworkId, center: card.offsetLeft + card.offsetWidth / 2 - offset })),
          viewport.clientWidth / 2,
          viewport.clientWidth * 0.25,
          centeredIdRef.current,
          10
        ) : null;
        centeredIdRef.current = id;
        setCenteredArtworkId(previous => previous === id ? previous : id);
      }
      updateHoverFromPointer();
    };

    const measure = () => {
      // Variable-width images still need enough space to center the end artworks.
      track.style.setProperty('--start-padding', `${Math.max(0, (viewport.clientWidth - (cards[0]?.offsetWidth || 0)) / 2)}px`);
      track.style.setProperty('--end-padding', `${Math.max(0, (viewport.clientWidth - (cards[cards.length - 1]?.offsetWidth || 0)) / 2)}px`);
      maxOffsetRef.current = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const boundedCurrent = Math.min(currentOffsetRef.current, maxOffsetRef.current);
      targetOffsetRef.current = Math.min(targetOffsetRef.current, maxOffsetRef.current);
      renderOffset(boundedCurrent);
    };

    const animateOffset = () => {
      const distance = targetOffsetRef.current - currentOffsetRef.current;
      if (reducedMotion || Math.abs(distance) < 0.5) {
        renderOffset(targetOffsetRef.current);
        animationFrameRef.current = null;
        return;
      }

      renderOffset(currentOffsetRef.current + distance * damping);
      animationFrameRef.current = window.requestAnimationFrame(animateOffset);
    };

    const addDelta = delta => {
      targetOffsetRef.current = getNextGalleryOffset(
        targetOffsetRef.current,
        delta,
        maxOffsetRef.current,
        sensitivity
      );
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animateOffset);
      }
    };

    returnToStartRef.current = () => {
      pauseAuto();
      leaveKeyboardMode();
      stopTouchMotion();
      returningToStart = true;
      setAtEnd(false);
      viewport.focus({ preventScroll: true });
      const start = currentOffsetRef.current;
      if (reducedMotion) {
        targetOffsetRef.current = 0;
        renderOffset(0);
        returningToStart = false;
        return;
      }
      let started = null;
      const returnFrame = timestamp => {
        if (started === null) started = timestamp;
        const progress = Math.min(1, (timestamp - started) / 3200);
        // Quintic easing exaggerates the quiet ends and fast middle of the return.
        const eased = progress < 0.5 ? 16 * progress ** 5 : 1 - (-2 * progress + 2) ** 5 / 2;
        const next = start * (1 - eased);
        targetOffsetRef.current = next;
        renderOffset(next);
        if (progress === 1) returningToStart = false;
        animationFrameRef.current = progress < 1 ? window.requestAnimationFrame(returnFrame) : null;
      };
      animationFrameRef.current = window.requestAnimationFrame(returnFrame);
    };

    const coastWheel = timestamp => {
      const elapsed = wheelTime === null ? 1000 / 60 : Math.max(0, timestamp - wheelTime);
      wheelTime = timestamp;
      const decay = Math.exp(-elapsed / 320);
      const next = getNextGalleryOffset(currentOffsetRef.current, wheelVelocity * 320 * (1 - decay), maxOffsetRef.current);
      wheelVelocity *= decay;
      targetOffsetRef.current = next;
      renderOffset(next);
      if (next <= 0 || next >= maxOffsetRef.current || Math.abs(wheelVelocity) < 0.02) {
        wheelVelocity = 0;
        wheelTime = null;
        animationFrameRef.current = null;
      } else {
        animationFrameRef.current = window.requestAnimationFrame(coastWheel);
      }
    };

    const handleWheel = event => {
      if (event.ctrlKey) return; // Preserve trackpad pinch zoom.
      const delta = getWheelDelta(event, viewport.clientWidth, viewport.clientHeight);
      if (!delta) return;
      pauseAuto();
      leaveKeyboardMode();
      event.preventDefault();
      if (mobile || reducedMotion) {
        stopTouchMotion();
        addDelta(delta);
        return;
      }
      // Add bounded impulses; reversal discards the old direction immediately.
      const velocity = wheelVelocity * delta > 0 ? wheelVelocity : 0;
      const previousWheelTime = wheelTime;
      stopTouchMotion();
      wheelTime = previousWheelTime;
      wheelVelocity = Math.max(-4, Math.min(4, velocity + delta * sensitivity / 160));
      animationFrameRef.current = window.requestAnimationFrame(coastWheel);
    };

    const resetPointerOffsets = () => {
      currentTilt = 0;
      viewport.style.setProperty('--pointer-tilt-y', '0deg');
      cards.forEach((card, index) => {
        pointerOffsets[index] = { x: 0, y: 0 };
        card.style.setProperty('--pointer-offset-x', '0px');
        card.style.setProperty('--pointer-offset-y', '0px');
      });
    };

    const updatePointerOffsets = timestamp => {
      pointerFrameRef.current = null;
      const point = latestPointerRef.current;
      const rect = pointerArea.getBoundingClientRect();
      const normalizedX = point && rect.width ? ((point.x - rect.left) / rect.width) * 2 - 1 : 0;
      const normalizedY = point && rect.height ? ((point.y - rect.top) / rect.height) * 2 - 1 : 0;
      const elapsed = previousPointerTime === null ? 1000 / 60 : Math.min(timestamp - previousPointerTime, 64);
      const smoothing = 1 - Math.exp(-elapsed / 100);
      previousPointerTime = timestamp;
      const targetTilt = -Math.max(-1, Math.min(1, normalizedX)) * pointerTiltY;
      const tiltDistance = targetTilt - currentTilt;
      let moving = Math.abs(tiltDistance) >= 0.01;
      currentTilt = moving ? currentTilt + tiltDistance * smoothing : targetTilt;
      viewport.style.setProperty('--pointer-tilt-y', currentTilt + 'deg');

      cards.forEach((card, index) => {
        const depth = Math.min(1, 0.42 + (index % 5) * 0.14);
        const target = getPointerParallaxOffset(normalizedX, normalizedY, depth, pointerMoveX, pointerMoveY);
        const current = pointerOffsets[index];
        ['x', 'y'].forEach(axis => {
          const distance = target[axis] - current[axis];
          if (Math.abs(distance) < 0.05) {
            current[axis] = target[axis];
          } else {
            current[axis] += distance * smoothing;
            moving = true;
          }
        });
        card.style.setProperty('--pointer-offset-x', current.x + 'px');
        card.style.setProperty('--pointer-offset-y', current.y + 'px');
      });
      updateHoverFromPointer();
      if (moving) {
        pointerFrameRef.current = window.requestAnimationFrame(updatePointerOffsets);
      } else {
        previousPointerTime = null;
      }
    };

    const schedulePointerUpdate = () => {
      if (enabled && !mobile && !reducedMotion && pointerFrameRef.current === null) {
        pointerFrameRef.current = window.requestAnimationFrame(updatePointerOffsets);
      }
    };

    const handlePointerMove = event => {
      if (mobile || (event.pointerType && event.pointerType !== 'mouse')) return;
      if (keyboardIdRef.current !== null) {
        stopTouchMotion();
        leaveKeyboardMode();
      }
      latestPointerRef.current = { x: event.clientX, y: event.clientY };
      updateHoverFromPointer();
      schedulePointerUpdate();
    };

    const handlePointerLeave = () => {
      setHoveredArtworkId(null);
      latestPointerRef.current = null;
      schedulePointerUpdate();
    };

    const handleResize = () => {
      measure();
      const selected = cards.find(card => card.dataset.artworkId === keyboardIdRef.current);
      if (selected) {
        stopTouchMotion();
        targetOffsetRef.current = getNextGalleryOffset(0, selected.offsetLeft + selected.offsetWidth / 2 - viewport.clientWidth / 2, maxOffsetRef.current);
        renderOffset(targetOffsetRef.current);
      }
      schedulePointerUpdate();
    };

    const handleKeyDown = event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest?.('input, textarea, select, [contenteditable="true"]') || !cards.length) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      pauseAuto();
      stopTouchMotion();
      let index = cards.findIndex(card => card.dataset.artworkId === keyboardIdRef.current);
      if (index === -1) {
        const center = currentOffsetRef.current + viewport.clientWidth / 2;
        index = cards.reduce((nearest, card, candidate) =>
          Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(cards[nearest].offsetLeft + cards[nearest].offsetWidth / 2 - center) ? candidate : nearest, 0);
      } else index = Math.max(0, Math.min(cards.length - 1, index + direction));
      const selected = cards[index];
      keyboardIdRef.current = selected.dataset.artworkId;
      setKeyboardArtworkId(keyboardIdRef.current);
      setHoveredArtworkId(null);
      latestPointerRef.current = null;
      if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
      previousPointerTime = null;
      resetPointerOffsets();
      targetOffsetRef.current = getNextGalleryOffset(0, selected.offsetLeft + selected.offsetWidth / 2 - viewport.clientWidth / 2, maxOffsetRef.current);
      animationFrameRef.current = window.requestAnimationFrame(animateOffset);
    };

    const handleTouchStart = event => {
      pauseAuto();
      touchTravelRef.current = 0;
      leaveKeyboardMode();
      stopTouchMotion();
      lastTouchTime = performance.now();
      if (event.touches && event.touches.length > 1) {
        previousTouchXRef.current = null;
        return;
      }
      previousTouchXRef.current = event.changedTouches[0]?.clientX ?? null;
    };

    const handleTouchMove = event => {
      if (event.touches && event.touches.length > 1) {
        previousTouchXRef.current = null;
        if (mobile) stopTouchMotion();
        return;
      }
      if (previousTouchXRef.current === null) return;
      const nextTouchX = event.changedTouches[0]?.clientX;
      if (typeof nextTouchX !== 'number') return;
      const delta = previousTouchXRef.current - nextTouchX;
      touchTravelRef.current += Math.abs(delta);
      previousTouchXRef.current = nextTouchX;
      const now = performance.now();
      const elapsed = now - lastTouchTime;
      if (mobile && elapsed > 0) {
        const velocity = delta / Math.max(8, elapsed);
        touchVelocity = elapsed > 100 || velocity * touchVelocity <= 0
          ? velocity
          : touchVelocity * 0.35 + velocity * 0.65;
        touchVelocity = Math.max(-4, Math.min(4, touchVelocity));
      }
      lastTouchTime = now;
      if (Math.abs(delta) > 0) {
        pauseAuto();
        event.preventDefault();
        if (mobile) {
          // Follow the finger directly; no mouse parallax or wheel sensitivity.
          if (animationFrameRef.current !== null) {
            window.cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          targetOffsetRef.current = getNextGalleryOffset(currentOffsetRef.current, delta, maxOffsetRef.current);
          renderOffset(targetOffsetRef.current);
        } else {
          addDelta(delta);
        }
      }
    };

    const handleTouchEnd = () => {
      pauseAuto();
      const wasDragging = previousTouchXRef.current !== null;
      previousTouchXRef.current = null;
      if (!mobile || !wasDragging || reducedMotion || performance.now() - lastTouchTime > 100 || Math.abs(touchVelocity) < 0.08) {
        touchVelocity = 0;
        return;
      }
      let previousTime = null;
      const coast = timestamp => {
        const elapsed = previousTime === null ? 1000 / 60 : Math.max(0, timestamp - previousTime);
        previousTime = timestamp;
        // Integrate exponential friction so distance is independent of refresh rate.
        const decay = Math.exp(-elapsed / 420);
        const distance = touchVelocity * 420 * (1 - decay);
        const next = getNextGalleryOffset(currentOffsetRef.current, distance, maxOffsetRef.current);
        touchVelocity *= decay;
        targetOffsetRef.current = next;
        renderOffset(next);
        if (next <= 0 || next >= maxOffsetRef.current || Math.abs(touchVelocity) < 0.02) {
          touchVelocity = 0;
          animationFrameRef.current = null;
          return;
        }
        animationFrameRef.current = window.requestAnimationFrame(coast);
      };
      animationFrameRef.current = window.requestAnimationFrame(coast);
    };

    const handleTouchCancel = () => {
      previousTouchXRef.current = null;
      stopTouchMotion();
    };

    resetPointerOffsets();
    latestPointerRef.current = null;
    measure();
    if (enabled && targetOffsetRef.current !== currentOffsetRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(animateOffset);
    }
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(handleResize);
    resizeObserver?.observe(viewport);
    resizeObserver?.observe(track);
    cards.forEach(card => resizeObserver?.observe(card));
    startAuto();

    if (enabled) {
      root.addEventListener('wheel', handleWheel, { passive: false });
      pointerArea.addEventListener('pointermove', handlePointerMove, true);
      pointerArea.addEventListener('pointerleave', handlePointerLeave);
      pointerArea.addEventListener('pointercancel', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);
      window.addEventListener('keydown', handleKeyDown);
      viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
      viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
      viewport.addEventListener('touchend', handleTouchEnd, { passive: true });
      viewport.addEventListener('touchcancel', handleTouchCancel, { passive: true });
      window.addEventListener('blur', handleTouchCancel);
      window.addEventListener('resize', handleResize);
      window.addEventListener('blur', suspendAuto);
      window.addEventListener('focus', resumeAuto);
      document.addEventListener('visibilitychange', visibilityChanged);
    }

    return () => {
      stopAuto();
      window.clearTimeout(idleTimer);
      window.removeEventListener('blur', suspendAuto);
      window.removeEventListener('focus', resumeAuto);
      document.removeEventListener('visibilitychange', visibilityChanged);
      resizeObserver?.disconnect();
      returnToStartRef.current = null;
      root.removeEventListener('wheel', handleWheel);
      pointerArea.removeEventListener('pointermove', handlePointerMove, true);
      pointerArea.removeEventListener('pointerleave', handlePointerLeave);
      pointerArea.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('keydown', handleKeyDown);
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
      viewport.removeEventListener('touchend', handleTouchEnd);
      viewport.removeEventListener('touchcancel', handleTouchCancel);
      window.removeEventListener('blur', handleTouchCancel);
      window.removeEventListener('resize', handleResize);
      latestPointerRef.current = null;
      previousTouchXRef.current = null;
      resetPointerOffsets();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
        pointerFrameRef.current = null;
      }
    };
  }, [artworks, damping, enabled, mobile, pointerAreaRef, pointerMoveX, pointerMoveY, pointerTiltY, reducedMotion, sensitivity, autoFlow, autoFlowSpeed, autoFlowIdleMs]);

  useEffect(() => {
    if (!enabled) setHoveredArtworkId(null);
  }, [enabled]);

  const selectedArtworkId = keyboardArtworkId ?? (mobile ? centeredArtworkId : hoveredArtworkId);
  const activeArtwork = enabled ? artworks.find(artwork => artwork.id === selectedArtworkId) : null;
  useLayoutEffect(() => {
    if (!activeArtwork) return undefined;
    const root = rootRef.current;
    const image = Array.from(trackRef.current.querySelectorAll('img[data-hover-artwork-id]'))
      .find(element => element.dataset.hoverArtworkId === activeArtwork.id);
    if (!root || !image) return undefined;
    const positionInfo = () => {
      const rootRect = root.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      // Desktop captions keep a stable baseline while hover/3D transforms move images.
      const imageBottom = mobile ? imageRect.bottom - rootRect.top : rootRect.height * 0.465 + image.offsetHeight / 2;
      const bottom = Math.min(rootRect.height, Math.max(0, imageBottom));
      root.style.setProperty('--mobile-image-bottom', `${bottom}px`);
    };
    positionInfo();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(positionInfo);
    observer?.observe(root);
    observer?.observe(image);
    image.addEventListener('load', positionInfo);
    window.addEventListener('resize', positionInfo);
    return () => {
      observer?.disconnect();
      image.removeEventListener('load', positionInfo);
      window.removeEventListener('resize', positionInfo);
    };
  }, [mobile, activeArtwork]);
  useEffect(() => {
    if (activeArtwork) {
      setCaption({ artwork: activeArtwork, mobile, exiting: false, version: ++captionVersionRef.current });
    } else if (reducedMotion || !enabled) {
      setCaption(null);
    } else {
      setCaption(previous => previous && previous.mobile === mobile ? { ...previous, exiting: true } : null);
    }
  }, [activeArtwork, enabled, mobile, reducedMotion]);

  useLayoutEffect(() => {
    if (!caption || !captionElementRef.current) return undefined;
    const letters = Array.from(captionElementRef.current.querySelectorAll('[data-caption-letter]'));
    const delay = letterDelay(letters.length);
    const duration = 480 + (letters.length - 1) * delay;
    const playback = captionPlaybackRef.current;
    if (playback.version !== caption.version) {
      playback.version = caption.version;
      playback.time = 0;
    }
    let frame = null;
    let previousTime = null;
    const paint = () => {
      letters.forEach((letter, index) => {
        const progress = reducedMotion ? 1 : Math.min(1, Math.max(0, (playback.time - index * delay) / 480));
        const eased = 1 - Math.pow(1 - progress, 3);
        letter.style.transform = 'translateY(' + ((1 - eased) * 110) + '%)';
        letter.style.opacity = String(eased);
      });
    };
    const tick = timestamp => {
      const elapsed = previousTime === null ? 0 : Math.max(0, timestamp - previousTime);
      previousTime = timestamp;
      playback.time = Math.min(duration, Math.max(0, playback.time + (caption.exiting ? -1 : 1) * elapsed * 1.5));
      paint();
      if (caption.exiting && playback.time === 0) {
        setCaption(current => current === caption ? null : current);
      } else if (caption.exiting || playback.time < duration) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    // Preserve both position and opacity when changing playback direction.
    paint();
    if (!reducedMotion) frame = window.requestAnimationFrame(tick);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [caption, reducedMotion]);

  const text = caption ? captionText(caption.artwork) : '';
  const titleLetters = splitLetters(text);

  return (
    <GalleryRoot ref={rootRef}>
      <GalleryViewport ref={viewportRef} $mobile={mobile} $enabled={enabled} tabIndex={enabled ? 0 : -1} aria-label="Artwork gallery">
        <GalleryPlane>
        <GalleryTrack ref={trackRef} $mobile={mobile}>
          {artworks.map(artwork => (
            <ArtworkCard key={artwork.id} type="button" data-artwork-id={artwork.id} aria-label={`${artwork.title} 상세 보기`} aria-disabled={!enabled} tabIndex={enabled ? 0 : -1} onClick={() => {
                if (!enabled) return;
                if (touchTravelRef.current > 8) { touchTravelRef.current = 0; return; }
                onArtworkOpen?.(artwork);
              }}>
              <ArtworkImage
                bare
                src={artwork.image}
                alt={artwork.title}
                draggable="false"
                data-hover-artwork-id={artwork.id}
                $hovered={!mobile && enabled && selectedArtworkId === artwork.id}
                $color={mobile || !enabled || !selectedArtworkId || selectedArtworkId === artwork.id}
                onPointerEnter={event => {
                  if (!mobile && enabled && event.pointerType !== 'touch') setHoveredArtworkId(artwork.id);
                }}
                onPointerLeave={() => setHoveredArtworkId(id => id === artwork.id ? null : id)}
                onPointerCancel={() => setHoveredArtworkId(null)}
                $hoverScale={hoverScale}
                $hoverDuration={hoverDurationMs}
              />
              <ImageFallback style={{ display: 'none' }}>IMAGE UNAVAILABLE</ImageFallback>
            </ArtworkCard>
          ))}
        </GalleryTrack>
        </GalleryPlane>
      </GalleryViewport>
      <BackButton type="button" $visible={enabled && atEnd} tabIndex={enabled && atEnd ? 0 : -1}
        aria-hidden={!enabled || !atEnd} aria-label="작품 목록 처음으로 돌아가기" onClick={() => returnToStartRef.current?.()}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 4L7 12l8 8" stroke="currentColor" strokeWidth="2.5" /></svg>
        <span aria-hidden="true">TO START</span>
      </BackButton>
      {showArtworkInfo && (mobile ? (
        <MobileArtworkInfo ref={captionElementRef} aria-live="polite" aria-atomic="true" data-phase={caption?.exiting ? 'exiting' : 'entering'}>
          {caption && [ ['h2', caption.artwork.title], ['p', String(caption.artwork.year ?? '')] ].map(([Tag, value]) => (
            <Tag key={`${caption.version}-${Tag}`} aria-label={value}>
              {splitLetters(value).map((letter, index) => (
                <LetterMask key={index} aria-hidden="true">
                  <TitleLetter data-caption-letter>{letter}</TitleLetter>
                </LetterMask>
              ))}
            </Tag>
          ))}
        </MobileArtworkInfo>
      ) : <ArtworkInfo aria-live="polite" aria-atomic="true">
        {caption && (
            <ArtworkName ref={captionElementRef} key={caption.version} aria-label={text} data-phase={caption.exiting ? 'exiting' : 'entering'}>
              {titleLetters.map((letter, index) => (
                <LetterMask key={index} aria-hidden="true">
                  <TitleLetter data-caption-letter style={{ '--letter-delay': `${index * letterDelay(titleLetters.length)}ms` }}>{letter}</TitleLetter>
                </LetterMask>
              ))}
            </ArtworkName>
        )}
      </ArtworkInfo>)}
    </GalleryRoot>
  );
};

export default ContinuousArtworkGallery;
