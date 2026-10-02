import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PageTransitionProvider, TransitionLink } from '../components/PageTransition';
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import IndexPrototype from './IndexPrototype';

jest.mock('../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [] }) }));
jest.mock('../contexts/ProfileContext', () => ({ useProfile: () => ({ profile: {} }) }));
jest.mock('../components/index/ContinuousArtworkGallery', () => ({ enabled }) => (
  <div data-testid="gallery" data-enabled={String(enabled)} />
));

let originalMatchMedia;
beforeEach(() => {
  jest.useFakeTimers();
  originalMatchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
});
afterEach(() => {
  jest.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

test('finishes text entry and exit before revealing and enabling gallery, without video', () => {
  const { container } = render(<MemoryRouter><IndexPrototype /></MemoryRouter>);
  expect(container.querySelector('video')).toBeNull();
  expect(container.querySelector('footer')?.textContent).toContain('Copyright 2025, Limyunmook');
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('STUDIOLIM YUN MOOK');
  expect(screen.getByTestId('gallery').dataset.enabled).toBe('false');
  act(() => jest.advanceTimersByTime(1525));
  expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  act(() => jest.advanceTimersByTime(1175));
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  expect(screen.getByTestId('gallery').dataset.enabled).toBe('false');
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByTestId('gallery').dataset.enabled).toBe('true');
});

test('reduced motion reveals the gallery immediately and cleanup cancels intro timers', () => {
  const first = render(<MemoryRouter><IndexPrototype /></MemoryRouter>);
  first.unmount();
  expect(jest.getTimerCount()).toBe(0);
  window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  render(<MemoryRouter><IndexPrototype /></MemoryRouter>);
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  expect(screen.getByTestId('gallery').dataset.enabled).toBe('true');
});

test('gallery remains enabled on repeated GNB returns without replaying the intro', () => {
  render(<MemoryRouter initialEntries={['/']}>
    <PageTransitionProvider><Routes>
      <Route path="/" element={<IndexPrototype />} />
      <Route path="/works" element={<TransitionLink to="/">Return to home</TransitionLink>} />
    </Routes></PageTransitionProvider>
  </MemoryRouter>);
  act(() => jest.advanceTimersByTime(3700));
  expect(screen.getByTestId('gallery').dataset.enabled).toBe('true');
  for (let visit = 0; visit < 2; visit += 1) {
    fireEvent.click(screen.getByRole('link', { name: 'Works' }));
    act(() => jest.advanceTimersByTime(1600));
    fireEvent.click(screen.getByRole('link', { name: 'Return to home' }));
    act(() => jest.advanceTimersByTime(1600));
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByTestId('gallery').dataset.enabled).toBe('true');
    expect(screen.getByTestId('gallery').closest('[inert]')).toBeNull();
  }
});
