import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArchivePrototype from './ArchivePrototype';
import ArtworkDetail from './ArtworkDetail';

jest.mock('../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [
  { id: 'one', title: 'First work', year: '2024', size: '40 x 50 cm', material: 'Oil on canvas', image: '/one.jpg' },
  { id: 'two', title: 'Second work', year: '2023', image: '/two.jpg' }
] }) }));

const show = () => render(<MemoryRouter><ArchivePrototype /></MemoryRouter>);

test('shows All and only years with artworks as direct filters', () => {
  jest.useFakeTimers();
  show();
  const filters = screen.getByLabelText('작품 연도 필터');
  expect(within(filters).getAllByRole('button').map(button => button.textContent)).toEqual(['All', '2023', '2024']);
  expect(within(filters).getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByAltText('First work')).toBeTruthy();
  expect(screen.getByAltText('Second work')).toBeTruthy();
  fireEvent.click(within(filters).getByRole('button', { name: '2024' }));
  expect(screen.getByAltText('Second work')).toBeTruthy();
  expect(screen.getByRole('region', { name: '작품 목록' }).getAttribute('aria-busy')).toBe('true');
  act(() => jest.advanceTimersByTime(219));
  expect(screen.getByAltText('Second work')).toBeTruthy();
  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryByAltText('Second work')).toBeNull();
  act(() => jest.advanceTimersByTime(20));
  expect(within(filters).getByRole('button', { name: '2024' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(within(filters).getByRole('button', { name: 'All' }));
  expect(screen.queryByAltText('Second work')).toBeNull();
  act(() => jest.advanceTimersByTime(240));
  expect(screen.getByAltText('Second work')).toBeTruthy();
  expect(screen.queryByRole('dialog')).toBeNull();
  jest.useRealTimers();
});

test('a registered year filters artworks and All restores the list', () => {
  jest.useFakeTimers();
  show();
  expect(screen.queryByRole('button', { name: '2021' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '2023' }));
  act(() => jest.advanceTimersByTime(240));
  expect(screen.queryByAltText('First work')).toBeNull();
  expect(screen.getByAltText('Second work')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'All' }));
  act(() => jest.advanceTimersByTime(240));
  expect(screen.getByAltText('First work')).toBeTruthy();
  const rail = screen.getByRole('region', { name: '작품 목록' });
  expect(rail).toBeTruthy();
  expect(screen.getByRole('button', { name: '맨 위로' })).toBeTruthy();
  jest.useRealTimers();
});

test('vertical wheel input coasts after input and reverses on opposite input', () => {
  const frames = new Map();
  let frameId = 0;
  let timestamp = 0;
  const request = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++frameId, callback);
    return frameId;
  });
  const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id));
  try {
    show();
    const page = screen.getByRole('main');
    Object.defineProperty(page, 'scrollHeight', { configurable: true, value: 3000 });
    Object.defineProperty(page, 'clientHeight', { configurable: true, value: 800 });
    fireEvent.wheel(page, { deltaY: 120 });
    expect(frames.size).toBe(1);
    const advance = count => act(() => {
      for (let index = 0; index < count; index += 1) {
        const callbacks = [...frames.values()];
        frames.clear();
        timestamp += 1000 / 60;
        callbacks.forEach(callback => callback(timestamp));
      }
    });
    advance(1);
    const firstPosition = page.scrollTop;
    advance(8);
    expect(page.scrollTop).toBeGreaterThan(firstPosition);
    const beforeReverse = page.scrollTop;
    fireEvent.wheel(page, { deltaY: -120 });
    advance(2);
    expect(page.scrollTop).toBeLessThan(beforeReverse);
  } finally {
    request.mockRestore();
    cancel.mockRestore();
  }
});

test('loaded artworks reveal from left to right only after entering the viewport', () => {
  jest.useFakeTimers();
  const originalObserver = window.IntersectionObserver;
  let notify;
  const observed = [];
  window.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    observe(element) { observed.push(element); }
    unobserve() {}
    disconnect() {}
  };
  try {
    show();
    const first = screen.getByAltText('First work').closest('[data-artwork-index]');
    const second = screen.getByAltText('Second work').closest('[data-artwork-index]');
    expect(first.getAttribute('data-revealed')).toBe('false');
    expect(second.getAttribute('data-revealed')).toBe('false');
    fireEvent.load(screen.getByAltText('Second work'));
    fireEvent.load(screen.getByAltText('First work'));
    expect(first.getAttribute('data-revealed')).toBe('false');
    act(() => notify(observed.map(target => ({ target, isIntersecting: true }))));
    expect(first.getAttribute('data-revealed')).toBe('true');
    expect(second.getAttribute('data-revealed')).toBe('false');
    act(() => jest.advanceTimersByTime(115));
    expect(second.getAttribute('data-revealed')).toBe('true');
  } finally {
    window.IntersectionObserver = originalObserver;
    jest.useRealTimers();
  }
});

test('an artwork below the viewport stays hidden until it enters', () => {
  jest.useFakeTimers();
  const originalObserver = window.IntersectionObserver;
  let notify;
  const observed = [];
  window.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    observe(element) { observed.push(element); }
    unobserve() {}
    disconnect() {}
  };
  try {
    show();
    const first = screen.getByAltText('First work').closest('[data-artwork-index]');
    const second = screen.getByAltText('Second work').closest('[data-artwork-index]');
    fireEvent.load(screen.getByAltText('First work'));
    fireEvent.load(screen.getByAltText('Second work'));
    act(() => notify([{ target: observed[0], isIntersecting: true }]));
    expect(first.getAttribute('data-revealed')).toBe('true');
    expect(second.getAttribute('data-revealed')).toBe('false');
    act(() => notify([{ target: observed[1], isIntersecting: true }]));
    act(() => jest.advanceTimersByTime(115));
    expect(second.getAttribute('data-revealed')).toBe('true');
  } finally {
    window.IntersectionObserver = originalObserver;
    jest.useRealTimers();
  }
});

test('artwork detail returns to works with the selected year preserved', () => {
  jest.useFakeTimers();
  render(<MemoryRouter initialEntries={['/works']}><Routes>
    <Route path="/works" element={<ArchivePrototype />} />
    <Route path="/works/:artworkId" element={<ArtworkDetail />} />
  </Routes></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: '2024' }));
  act(() => jest.advanceTimersByTime(240));
  fireEvent.click(screen.getByRole('link', { name: 'First work 상세 보기' }));
  expect(screen.getByRole('heading', { level: 1, name: 'First work' })).toBeTruthy();
  expect(screen.getByText('40 x 50 cm, Oil on canvas, 2024')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Works로 돌아가기' }));
  expect(screen.queryByRole('heading', { level: 1, name: 'WORKS' })).toBeNull();
  expect(screen.getByRole('button', { name: '2024' }).getAttribute('aria-pressed')).toBe('true');
  expect(screen.queryByAltText('Second work')).toBeNull();
  jest.useRealTimers();
});

test('artwork detail entered from home returns home', () => {
  render(<MemoryRouter initialEntries={[{ pathname: '/works/one', state: { from: '/' } }]}><Routes>
    <Route path="/" element={<div>Home returned</div>} />
    <Route path="/works/:artworkId" element={<ArtworkDetail />} />
  </Routes></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Home으로 돌아가기' }));
  expect(screen.getByText('Home returned')).toBeTruthy();
});

test('detail content is visible as the page slides in', () => {
  render(<MemoryRouter initialEntries={[{ pathname: '/works/one', state: { from: '/' } }]}><Routes>
    <Route path="/works/:artworkId" element={<ArtworkDetail />} />
  </Routes></MemoryRouter>);
  expect(screen.getByAltText('First work')).toBeTruthy();
  expect(screen.getByRole('heading', { level: 1, name: 'First work' })).toBeTruthy();
  expect(screen.getByRole('main').hasAttribute('data-page-transition-source')).toBe(true);
});
