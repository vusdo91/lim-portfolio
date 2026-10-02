import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ContinuousArtworkGallery from './ContinuousArtworkGallery';
import { indexPrototypeConfig as config } from '../../data/indexPrototypeArtworks';

const artworks = [
  { id: 'first', title: 'First artwork', year: '2024', image: '/first.jpg' },
  { id: 'second', title: 'Second artwork', year: '2025', image: '/second.jpg' }
];
let frames;
let timestamp;
let motionQuery;
let mobileQuery;
let originalMatchMedia;

const gallery = (enabled = true, pointerAreaRef, pointerTiltY = 0, onArtworkOpen) => (
  <ContinuousArtworkGallery
    onArtworkOpen={onArtworkOpen}
    pointerTiltY={pointerTiltY}
    pointerAreaRef={pointerAreaRef}
    artworks={artworks} enabled={enabled}
    sensitivity={config.scrollSensitivity} damping={config.scrollDamping}
    centerZoneRatio={0.1} centerHysteresisPx={0}
    hoverScale={config.artworkHoverScale} hoverDurationMs={config.artworkHoverDurationMs}
    pointerMoveX={config.pointerMoveX} pointerMoveY={config.pointerMoveY}
  />
);

test('artwork images can open their detail page with a keyboard-accessible button', () => {
  const onArtworkOpen = jest.fn();
  render(gallery(true, undefined, 0, onArtworkOpen));
  fireEvent.click(screen.getByRole('button', { name: 'First artwork 상세 보기' }));
  expect(onArtworkOpen).toHaveBeenCalledWith(artworks[0]);
});

const settle = () => {
  for (let count = 0; frames.size && count < 300; count += 1) {
    act(() => {
      const callbacks = [...frames.values()];
      frames.clear();
      timestamp += 1000 / 60;
      callbacks.forEach(callback => callback(timestamp));
    });
  }
  expect(frames.size).toBe(0);
};

const pointerMove = (target, x, y, pointerType = 'mouse') => {
  const event = new Event('pointermove', { bubbles: true });
  Object.assign(event, { clientX: x, clientY: y, pointerType });
  fireEvent(target, event);
};

const advanceFrames = count => act(() => {
  for (let index = 0; index < count; index += 1) {
    const callbacks = [...frames.values()];
    frames.clear();
    timestamp += 1000 / 60;
    callbacks.forEach(callback => callback(timestamp));
  }
});

test('automatic flow yields to scrolling and resumes after idle, with blur and cleanup suspension', () => {
  const { container, unmount } = render(React.cloneElement(gallery(), { autoFlow: true, autoFlowSpeed: 64, autoFlowIdleMs: 3000 }));
  const track = container.querySelector('[data-artwork-id]').parentElement;
  const offset = () => -parseFloat(track.style.transform.slice(12));
  advanceFrames(61);
  expect(offset()).toBeCloseTo(64);
  fireEvent.wheel(container.firstChild, { deltaY: -10, deltaMode: 0 });
  settle();
  const manualPosition = offset();
  expect(manualPosition).toBeLessThan(64);
  act(() => jest.advanceTimersByTime(2999));
  expect(frames.size).toBe(0);
  act(() => jest.advanceTimersByTime(1));
  advanceFrames(61);
  expect(offset()).toBeCloseTo(manualPosition + 64);
  fireEvent.blur(window);
  const blurredPosition = offset();
  advanceFrames(20);
  expect(offset()).toBe(blurredPosition);
  fireEvent.focus(window);
  advanceFrames(10);
  expect(offset()).toBeGreaterThan(blurredPosition);
  unmount();
  expect(frames.size).toBe(0);
});

test('automatic flow waits for entry and respects reduced motion', () => {
  const { rerender } = render(React.cloneElement(gallery(false), { autoFlow: true }));
  expect(frames.size).toBe(0);
  rerender(React.cloneElement(gallery(), { autoFlow: true }));
  expect(frames.size).toBeGreaterThan(0);
  act(() => {
    motionQuery.matches = true;
    motionQuery.addEventListener.mock.calls[0][1]();
  });
  expect(frames.size).toBe(0);
});

test('automatic flow stops at the catalogue end without wrapping', () => {
  const { container } = render(React.cloneElement(gallery(), { autoFlow: true, autoFlowSpeed: 4000 }));
  const track = container.querySelector('[data-artwork-id]').parentElement;
  advanceFrames(61);
  expect(track.style.transform).toBe('translate3d(-2000px, 0, 0)');
  expect(frames.size).toBe(0);
  advanceFrames(20);
  expect(track.style.transform).toBe('translate3d(-2000px, 0, 0)');
});

test('keeps projected image hover actions synchronized while the tilted plane moves', () => {
  const originalHitTest = document.elementFromPoint;
  const { container, unmount } = render(gallery(true, undefined, 10));
  const first = screen.getByAltText('First artwork');
  const second = screen.getByAltText('Second artwork');
  let hit = first;
  document.elementFromPoint = jest.fn(() => hit);
  try {
    expect(getComputedStyle(screen.getByLabelText('Artwork gallery')).pointerEvents).toBe('none');
    expect(getComputedStyle(first).pointerEvents).toBe('auto');
    pointerMove(container.firstChild, 900, 400);
    advanceFrames(4);
    expect(screen.getByRole('heading', { name: 'First artwork / 2024' })).toBeTruthy();
    expect(getComputedStyle(first).transform).toBe('scale(1.045)');
    expect(getComputedStyle(second).filter).toBe('grayscale(1)');
    // The pointer is stationary; the moving plane puts a different image beneath it.
    hit = second;
    advanceFrames(4);
    expect(screen.getByRole('heading', { name: 'Second artwork / 2025' })).toBeTruthy();
    expect(getComputedStyle(first).transform).toBe('scale(1)');
    expect(getComputedStyle(second).transform).toBe('scale(1.045)');
    settle();
    // Wheel movement must also refresh the hit, even after pointer motion has settled.
    hit = null;
    fireEvent.wheel(container.firstChild, { deltaX: 0, deltaY: 40, deltaMode: 0 });
    advanceFrames(1);
    settle();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(getComputedStyle(second).transform).toBe('scale(1)');
    expect(getComputedStyle(first).filter).toBe('grayscale(0)');
  } finally {
    unmount();
    if (originalHitTest) document.elementFromPoint = originalHitTest;
    else delete document.elementFromPoint;
  }
});

test('adds depth in comparison mode and clears it when switching back', () => {
  const { container, rerender } = render(gallery(true, undefined, 10));
  const root = container.firstChild;
  const card = container.querySelector('[data-artwork-id]');
  pointerMove(root, 1000, 0);
  settle();
  expect(parseFloat(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y'))).toBeCloseTo(-10);
  pointerMove(root, 0, 1000);
  settle();
  expect(parseFloat(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y'))).toBeCloseTo(10);
  pointerMove(root, 500, 0);
  settle();
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-y'))).toBeCloseTo(15.12);
  expect(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y')).toBe('0deg');
  pointerMove(root, 500, 1000);
  settle();
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-y'))).toBeCloseTo(-15.12);
  fireEvent.pointerLeave(root);
  settle();
  expect(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y')).toBe('0deg');
  rerender(gallery());
  pointerMove(root, 1000, 0);
  settle();
  expect(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y')).toBe('0deg');
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-x'))).toBeCloseTo(-10.08);
});

beforeEach(() => {
  jest.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
  jest.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(200);
  jest.useFakeTimers();
  frames = new Map();
  timestamp = 0;
  let nextFrame = 0;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id));
  originalMatchMedia = window.matchMedia;
  motionQuery = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
  mobileQuery = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(query => query.includes('prefers-reduced-motion') ? motionQuery : mobileQuery);
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(630);
  jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(3000);
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
  jest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function () {
    return this.dataset.artworkId === 'second' ? 750 : 300;
  });
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0, top: 0, right: 1000, bottom: 1000, width: 1000, height: 1000
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  window.matchMedia = originalMatchMedia;
});

test('moves the artwork columns from outside the viewport and returns on page leave', () => {
  const { container } = render(gallery());
  const root = container.firstChild;
  const cards = container.querySelectorAll('[data-artwork-id]');
  pointerMove(root, 1000, 0);
  settle();
  expect(parseFloat(cards[0].style.getPropertyValue('--pointer-offset-x'))).toBeCloseTo(-10.08);
  expect(parseFloat(cards[0].style.getPropertyValue('--pointer-offset-y'))).toBeCloseTo(15.12);
  expect(parseFloat(cards[1].style.getPropertyValue('--pointer-offset-x'))).toBeLessThan(-10.08);
  fireEvent.pointerLeave(root);
  settle();
  expect(cards[0].style.getPropertyValue('--pointer-offset-x')).toBe('0px');
  expect(cards[0].style.getPropertyValue('--pointer-offset-y')).toBe('0px');
});

test('responds over page header and bottom whitespace outside the gallery', () => {
  const pageRef = React.createRef();
  const { container, unmount } = render(
    <main ref={pageRef}>
      <header>Page header</header>
      {gallery(true, pageRef)}
      <footer>Bottom whitespace</footer>
    </main>
  );
  const card = container.querySelector('[data-artwork-id]');
  const header = screen.getByText('Page header');
  const footer = screen.getByText('Bottom whitespace');
  header.addEventListener('pointermove', event => event.stopPropagation());
  pointerMove(header, 500, 0);
  settle();
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-y'))).toBeCloseTo(15.12);
  pointerMove(footer, 500, 1000);
  settle();
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-y'))).toBeCloseTo(-15.12);
  fireEvent.pointerLeave(pageRef.current);
  settle();
  expect(card.style.getPropertyValue('--pointer-offset-y')).toBe('0px');
  const page = pageRef.current;
  unmount();
  pointerMove(page, 500, 0);
  expect(frames.size).toBe(0);
});

test('keeps information hidden without hover and preserves independent wheel movement', () => {
  const { container } = render(gallery());
  const root = container.firstChild;
  const card = container.querySelector('[data-artwork-id]');
  expect(screen.queryByRole('heading')).toBeNull();
  pointerMove(root, 1000, 500);
  settle();
  expect(screen.queryByRole('heading', { name: 'First artwork / 2024' })).toBeNull();
  fireEvent.pointerLeave(root);
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
  pointerMove(root, 0, 500);
  fireEvent.wheel(root, { deltaY: 80, deltaX: 0, deltaMode: 0 });
  settle();
  expect(-parseFloat(card.parentElement.style.transform.slice(12))).toBeGreaterThan(108);
  expect(parseFloat(card.style.getPropertyValue('--pointer-offset-x'))).toBeCloseTo(10.08);
  fireEvent.wheel(root, { deltaY: -80, deltaX: 0, deltaMode: 0 });
  settle();
  expect(parseFloat(card.parentElement.style.transform.slice(12))).toBeCloseTo(0);
});

test('ignores intro and touch pointer movement and cancels pending frames on unmount', () => {
  const { container, rerender, unmount } = render(gallery(false));
  const root = container.firstChild;
  const card = container.querySelector('[data-artwork-id]');
  pointerMove(root, 1000, 0);
  expect(frames.size).toBe(0);
  rerender(gallery());
  pointerMove(root, 1000, 0, 'touch');
  expect(frames.size).toBe(0);
  expect(card.style.getPropertyValue('--pointer-offset-x')).toBe('0px');
  pointerMove(root, 1000, 0);
  expect(frames.size).toBe(1);
  unmount();
  expect(frames.size).toBe(0);
});

test('clears existing offsets when reduced motion is enabled and continues accepting wheel input', () => {
  const { container } = render(gallery());
  const root = container.firstChild;
  const card = container.querySelector('[data-artwork-id]');
  pointerMove(root, 1000, 0);
  settle();
  act(() => {
    motionQuery.matches = true;
    motionQuery.addEventListener.mock.calls[0][1]();
  });
  expect(card.style.getPropertyValue('--pointer-offset-x')).toBe('0px');
  pointerMove(root, 1000, 0);
  expect(frames.size).toBe(0);
  fireEvent.wheel(root, { deltaY: 80, deltaX: 0, deltaMode: 0 });
  settle();
  expect(card.parentElement.style.transform).toBe('translate3d(-108px, 0, 0)');
});


test('shows only hovered image in color and replaces the title and year together', () => {
  const { container } = render(gallery());
  const first = screen.getByAltText('First artwork');
  const second = screen.getByAltText('Second artwork');
  expect(getComputedStyle(first).filter).toBe('grayscale(0)');
  expect(getComputedStyle(second).filter).toBe('grayscale(0)');
  fireEvent.pointerOver(first);
  expect(screen.getByRole('heading', { name: 'First artwork / 2024' })).toBeTruthy();
  expect(getComputedStyle(first).opacity).toBe('1');
  expect(getComputedStyle(first).filter).toBe('grayscale(0)');
  expect(getComputedStyle(second).filter).toBe('grayscale(1)');
  const letters = screen.getByRole('heading').querySelectorAll('[style]');
  expect(letters).toHaveLength(Array.from('First artwork / 2024').length);
  expect(letters[0].style.getPropertyValue('--letter-delay')).toBe('0ms');
  expect(letters[1].style.getPropertyValue('--letter-delay')).toBe('35ms');
  fireEvent.pointerOut(first, { relatedTarget: second });
  fireEvent.pointerOver(second, { relatedTarget: first });
  expect(screen.getByRole('heading', { name: 'Second artwork / 2025' })).toBeTruthy();
  expect(screen.queryByText('2024')).toBeNull();
  expect(screen.getByRole('heading').textContent).toBe('Second artwork / 2025');
  expect(getComputedStyle(first).filter).toBe('grayscale(1)');
  expect(getComputedStyle(second).filter).toBe('grayscale(0)');
  fireEvent.pointerLeave(container.firstChild);
  expect(screen.getByRole('heading').dataset.phase).toBe('exiting');
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
  expect(getComputedStyle(first).filter).toBe('grayscale(0)');
  expect(getComputedStyle(second).filter).toBe('grayscale(0)');
});

test('does not show hover information during the intro and clears it on blur', () => {
  const { rerender } = render(gallery(false));
  fireEvent.pointerOver(screen.getByAltText('First artwork'));
  expect(screen.queryByRole('heading')).toBeNull();
  rerender(gallery());
  fireEvent.pointerOver(screen.getByAltText('First artwork'));
  expect(screen.getByRole('heading', { name: 'First artwork / 2024' })).toBeTruthy();
  fireEvent.blur(window);
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
});


test('interrupts reversed title and year exit immediately when another artwork is hovered', () => {
  render(gallery());
  const first = screen.getByAltText('First artwork');
  const second = screen.getByAltText('Second artwork');
  expect(getComputedStyle(first).opacity).toBe('1');
  expect(getComputedStyle(first).transition).toContain('filter 350ms');
  fireEvent.pointerOver(first);
  advanceFrames(12);
  expect(screen.getByRole('heading').textContent).toBe('First artwork / 2024');
  fireEvent.pointerOut(first);
  const exiting = screen.getByRole('heading');
  expect(exiting.dataset.phase).toBe('exiting');
  const letters = exiting.querySelectorAll('[style]');
  expect(letters[0].style.getPropertyValue('--letter-delay')).toBe('0ms');
  advanceFrames(4);
  fireEvent.pointerOver(second);
  const entering = screen.getByRole('heading', { name: 'Second artwork / 2025' });
  expect(entering.dataset.phase).toBe('entering');
  expect(entering).not.toBe(exiting);
  expect(entering.querySelector('[style]').style.getPropertyValue('--letter-delay')).toBe('0ms');
  settle();
  expect(screen.getByRole('heading')).toBe(entering);
});

test('reverses unfinished entry from the exact displayed position and opacity', () => {
  render(gallery());
  const first = screen.getByAltText('First artwork');
  fireEvent.pointerOver(first);
  advanceFrames(12);
  const heading = screen.getByRole('heading', { name: 'First artwork / 2024' });
  const letters = heading.querySelectorAll('[data-caption-letter]');
  const position = letters[0].style.transform;
  const opacity = Number(letters[0].style.opacity);
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  expect(letters[letters.length - 1].style.opacity).toBe('0');
  fireEvent.pointerOut(first);
  expect(screen.getByRole('heading')).toBe(heading);
  expect(letters[0].style.transform).toBe(position);
  expect(Number(letters[0].style.opacity)).toBe(opacity);
  advanceFrames(4);
  expect(Number(letters[0].style.opacity)).toBeLessThan(opacity);
  expect(letters[0].style.transform).not.toBe(position);
  expect(letters[letters.length - 1].style.opacity).toBe('0');
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
});

test('reentering the same artwork restarts entry and reduced motion removes exit immediately', () => {
  render(gallery());
  const first = screen.getByAltText('First artwork');
  fireEvent.pointerOver(first);
  fireEvent.pointerOut(first);
  const exiting = screen.getByRole('heading');
  fireEvent.pointerOver(first);
  expect(screen.getByRole('heading')).not.toBe(exiting);
  expect(screen.getByRole('heading').dataset.phase).toBe('entering');
  act(() => {
    motionQuery.matches = true;
    motionQuery.addEventListener.mock.calls[0][1]();
  });
  fireEvent.pointerOut(first);
  expect(screen.queryByRole('heading')).toBeNull();
});


test('mobile uses the central artwork with stacked information and bidirectional touch swipes', () => {
  mobileQuery.matches = true;
  render(gallery(true, undefined, 10));
  const viewport = screen.getByLabelText('Artwork gallery');
  const first = screen.getByAltText('First artwork');
  const second = screen.getByAltText('Second artwork');
  expect(screen.getByRole('heading', { name: 'First artwork' })).toBeTruthy();
  expect(screen.getByLabelText('2024')).toBeTruthy();
  expect(getComputedStyle(screen.getByRole('heading').parentElement).flexDirection).toBe('column');
  expect(getComputedStyle(first).filter).toBe('grayscale(0)');
  expect(getComputedStyle(second).filter).toBe('grayscale(1)');
  expect(getComputedStyle(viewport).pointerEvents).toBe('auto');
  settle();
  fireEvent.pointerOver(second);
  pointerMove(viewport, 1000, 0);
  expect(frames.size).toBe(0);
  expect(viewport.style.getPropertyValue('--pointer-tilt-y')).toBe('0deg');
  expect(first.parentElement.style.getPropertyValue('--pointer-offset-x')).toBe('0px');
  expect(first.parentElement.style.getPropertyValue('--pointer-offset-y')).toBe('0px');
  expect(getComputedStyle(first).transform).toBe('scale(1)');
  expect(screen.getByRole('heading').textContent).toBe('First artwork');
  fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 700 }] });
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 550 }] });
  expect(screen.getByRole('heading').textContent).toBe('Second artwork');
  expect(getComputedStyle(first).filter).toBe('grayscale(1)');
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 350 }] });
  expect(screen.getByRole('heading').textContent).toBe('Second artwork');
  expect(screen.getByLabelText('2025')).toBeTruthy();
  expect(getComputedStyle(second).filter).toBe('grayscale(0)');
  fireEvent.touchEnd(viewport);
  fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 350 }] });
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 700 }] });
  expect(screen.getByRole('heading').textContent).toBe('First artwork');
  fireEvent.touchCancel(viewport);
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 0 }] });
  expect(screen.getByRole('heading').textContent).toBe('First artwork');
});

test('mobile letters reverse from their current progress and new central artwork interrupts exit', () => {
  mobileQuery.matches = true;
  const { container } = render(gallery());
  const viewport = screen.getByLabelText('Artwork gallery');
  const firstLetter = container.querySelector('[data-caption-letter]');
  expect(firstLetter.style.opacity).toBe('0');
  advanceFrames(6);
  const partialOpacity = Number(firstLetter.style.opacity);
  expect(partialOpacity).toBeGreaterThan(0);
  expect(partialOpacity).toBeLessThan(1);
  fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 1000 }] });
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 200 }] });
  expect(screen.getByRole('heading').parentElement.dataset.phase).toBe('exiting');
  expect(Number(firstLetter.style.opacity)).toBe(partialOpacity);
  advanceFrames(3);
  expect(Number(firstLetter.style.opacity)).toBeLessThan(partialOpacity);
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 650 }] });
  expect(screen.getByRole('heading').textContent).toBe('Second artwork');
  expect(container.querySelector('[data-caption-letter]').style.opacity).toBe('0');
  settle();
  expect([...container.querySelectorAll('[data-caption-letter]')].every(letter => letter.style.opacity === '1')).toBe(true);
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 200 }] });
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
});

test('desktop wheel strength controls coasting distance and reversal and blur interrupt it', () => {
  const { container, unmount } = render(gallery());
  const track = screen.getByAltText('First artwork').parentElement.parentElement;
  const position = () => -parseFloat(track.style.transform.slice(12));
  fireEvent.wheel(container.firstChild, { deltaY: 40 });
  advanceFrames(4);
  const during = position();
  advanceFrames(12);
  expect(position()).toBeGreaterThan(during);
  settle();
  const gentleDistance = position();
  unmount();
  const next = render(gallery());
  const nextTrack = screen.getByAltText('First artwork').parentElement.parentElement;
  fireEvent.wheel(next.container.firstChild, { deltaY: 120 });
  settle();
  expect(-parseFloat(nextTrack.style.transform.slice(12))).toBeGreaterThan(gentleDistance * 2);
  fireEvent.wheel(next.container.firstChild, { deltaY: 120 });
  advanceFrames(4);
  const beforeReverse = -parseFloat(nextTrack.style.transform.slice(12));
  fireEvent.wheel(next.container.firstChild, { deltaY: -40 });
  advanceFrames(2);
  expect(-parseFloat(nextTrack.style.transform.slice(12))).toBeLessThan(beforeReverse);
  fireEvent.blur(window);
  const stopped = nextTrack.style.transform;
  settle();
  expect(nextTrack.style.transform).toBe(stopped);
  fireEvent.wheel(next.container.firstChild, { deltaY: 100000 });
  settle();
  expect(-parseFloat(nextTrack.style.transform.slice(12))).toBeLessThanOrEqual(2000);
});

test('shows BACK only at the scroll limit and returns to the beginning on click', () => {
  const { container } = render(gallery());
  const track = screen.getByAltText('First artwork').parentElement.parentElement;
  expect(screen.queryByRole('button', { name: '작품 목록 처음으로 돌아가기' })).toBeNull();
  for (let index = 0; index < 3; index += 1) {
    fireEvent.wheel(container.firstChild, { deltaY: 10000 });
    settle();
  }
  expect(track.style.transform).toBe('translate3d(-2000px, 0, 0)');
  fireEvent.click(screen.getByRole('button', { name: '작품 목록 처음으로 돌아가기' }));
  advanceFrames(3);
  expect(screen.queryByRole('button', { name: '작품 목록 처음으로 돌아가기' })).toBeNull();
  settle();
  expect(track.style.transform).toBe('translate3d(0px, 0, 0)');
  expect(screen.queryByRole('button', { name: '작품 목록 처음으로 돌아가기' })).toBeNull();
});

test('keyboard selects nearest first, steps by artwork, and mouse movement restores hover', () => {
  const { container } = render(gallery());
  const first = screen.getByAltText('First artwork');
  const second = screen.getByAltText('Second artwork');
  const track = first.parentElement.parentElement;
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  settle();
  expect(screen.getByRole('heading').textContent).toBe('First artwork / 2024');
  expect(getComputedStyle(second).filter).toBe('grayscale(1)');
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  settle();
  expect(track.style.transform).toBe('translate3d(-350px, 0, 0)');
  expect(screen.getByRole('heading').textContent).toBe('Second artwork / 2025');
  expect(getComputedStyle(second).transform).toBe('scale(1.045)');
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  settle();
  expect(track.style.transform).toBe('translate3d(-350px, 0, 0)');
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  settle();
  expect(screen.getByRole('heading').textContent).toBe('First artwork / 2024');
  pointerMove(container.firstChild, 500, 500);
  settle();
  expect(screen.queryByRole('heading')).toBeNull();
  expect(getComputedStyle(second).filter).toBe('grayscale(0)');
});

test('mobile caption follows the actual image bottom on load and resize', () => {
  mobileQuery.matches = true;
  const { container } = render(gallery());
  const root = container.firstChild;
  const image = screen.getByAltText('First artwork');
  Object.defineProperty(root, 'getBoundingClientRect', { configurable: true, value: () => ({ top: 0, height: 800 }) });
  const imageRect = jest.fn(() => ({ bottom: 480 }));
  Object.defineProperty(image, 'getBoundingClientRect', { configurable: true, value: imageRect });
  fireEvent.load(image);
  expect(root.style.getPropertyValue('--mobile-image-bottom')).toBe('480px');
  imageRect.mockReturnValue({ bottom: 400 });
  fireEvent(window, new Event('resize'));
  expect(root.style.getPropertyValue('--mobile-image-bottom')).toBe('400px');
  const info = screen.getByRole('heading').parentElement;
  expect(getComputedStyle(info).transform).toBe('translateY(-50%)');
  expect(getComputedStyle(image.parentElement.parentElement).gap).toBe('20px');
});

test('mobile intro stays grayscale and mode changes reset desktop parallax', () => {
  mobileQuery.matches = true;
  const { rerender, container } = render(gallery(false, undefined, 10));
  const first = screen.getByAltText('First artwork');
  expect(getComputedStyle(first).filter).toBe('grayscale(1)');
  expect(screen.queryByRole('heading')).toBeNull();
  fireEvent.touchStart(screen.getByLabelText('Artwork gallery'), { changedTouches: [{ clientX: 700 }] });
  fireEvent.touchMove(screen.getByLabelText('Artwork gallery'), { changedTouches: [{ clientX: 350 }] });
  rerender(gallery(true, undefined, 10));
  expect(screen.getByRole('heading').textContent).toBe('First artwork');
  act(() => {
    mobileQuery.matches = false;
    mobileQuery.addEventListener.mock.calls[0][1]();
  });
  expect(screen.queryByRole('heading')).toBeNull();
  pointerMove(container.firstChild, 1000, 0);
  settle();
  expect(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y')).toBe('-10deg');
  act(() => {
    mobileQuery.matches = true;
    mobileQuery.addEventListener.mock.calls[0][1]();
  });
  expect(screen.getByLabelText('Artwork gallery').style.getPropertyValue('--pointer-tilt-y')).toBe('0deg');
  expect(screen.getByRole('heading').textContent).toBe('First artwork');
});


test('fast mobile flicks coast farther than slow swipes and stop at the catalogue edge', () => {
  mobileQuery.matches = true;
  const swipe = duration => {
    const view = render(gallery());
    const viewport = screen.getByLabelText('Artwork gallery');
    const track = screen.getByAltText('First artwork').parentElement.parentElement;
    fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 500 }] });
    act(() => jest.advanceTimersByTime(duration));
    fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 400 }] });
    expect(track.style.transform).toBe('translate3d(-100px, 0, 0)');
    fireEvent.touchEnd(viewport);
    advanceFrames(4);
    expect(parseFloat(track.style.transform.slice(12))).toBeLessThan(-100);
    settle();
    const distance = -parseFloat(track.style.transform.slice(12));
    view.unmount();
    return distance;
  };
  const slow = swipe(250);
  const fast = swipe(25);
  expect(fast).toBeGreaterThan(slow * 3);
  expect(fast).toBeLessThanOrEqual(2000);
});

test('touching again brakes mobile inertia immediately and permits reversing direction', () => {
  mobileQuery.matches = true;
  render(gallery());
  const viewport = screen.getByLabelText('Artwork gallery');
  const track = screen.getByAltText('First artwork').parentElement.parentElement;
  fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 500 }] });
  act(() => jest.advanceTimersByTime(25));
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 400 }] });
  fireEvent.touchEnd(viewport);
  advanceFrames(8);
  const movingPosition = track.style.transform;
  fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 400 }] });
  advanceFrames(8);
  expect(track.style.transform).toBe(movingPosition);
  act(() => jest.advanceTimersByTime(25));
  fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 500 }] });
  fireEvent.touchEnd(viewport);
  settle();
  expect(track.style.transform).toBe('translate3d(0px, 0, 0)');
});

test('holding before release, cancelled gestures, and reduced motion do not launch inertia', () => {
  mobileQuery.matches = true;
  render(gallery());
  settle();
  const viewport = screen.getByLabelText('Artwork gallery');
  const drag = () => {
    fireEvent.touchStart(viewport, { changedTouches: [{ clientX: 500 }] });
    act(() => jest.advanceTimersByTime(25));
    fireEvent.touchMove(viewport, { changedTouches: [{ clientX: 400 }] });
  };
  drag();
  act(() => jest.advanceTimersByTime(150));
  fireEvent.touchEnd(viewport);
  let stoppedPosition = screen.getByAltText('First artwork').parentElement.parentElement.style.transform;
  settle();
  expect(screen.getByAltText('First artwork').parentElement.parentElement.style.transform).toBe(stoppedPosition);
  drag();
  fireEvent.touchCancel(viewport);
  fireEvent.touchEnd(viewport);
  stoppedPosition = screen.getByAltText('First artwork').parentElement.parentElement.style.transform;
  settle();
  expect(screen.getByAltText('First artwork').parentElement.parentElement.style.transform).toBe(stoppedPosition);
  act(() => {
    motionQuery.matches = true;
    motionQuery.addEventListener.mock.calls[0][1]();
  });
  drag();
  fireEvent.touchEnd(viewport);
  expect(frames.size).toBe(0);
});
