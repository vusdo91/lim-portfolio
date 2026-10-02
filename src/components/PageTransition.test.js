import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { PageTransitionProvider, TransitionLink, useDetailTransition, useInitialIntro } from './PageTransition';

function Fixture() {
  const location = useLocation();
  const intro = useInitialIntro();
  return <><div data-testid="route">{location.pathname}</div><div data-testid="intro">{String(intro)}</div>
    <TransitionLink to="/works">Works</TransitionLink><TransitionLink to="/">Home</TransitionLink></>;
}
test('covers before navigation, skips same-page clicks, and suppresses return intro', () => {
  jest.useFakeTimers();
  const original = window.matchMedia;
  window.matchMedia = () => ({ matches: false });
  const view = render(<MemoryRouter initialEntries={['/']}><PageTransitionProvider><Fixture /></PageTransitionProvider></MemoryRouter>);
  expect(screen.getByTestId('intro').textContent).toBe('true');
  fireEvent.click(screen.getByText('Home'));
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByText('Works'));
  expect(screen.getByTestId('route').textContent).toBe('/');
  act(() => jest.advanceTimersByTime(850));
  expect(screen.getByTestId('route').textContent).toBe('/works');
  act(() => jest.advanceTimersByTime(750));
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByText('Works'));
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByText('Home'));
  act(() => jest.advanceTimersByTime(1600));
  expect(screen.getByTestId('intro').textContent).toBe('false');
  expect(screen.getByTestId('route').textContent).toBe('/');
  view.unmount();
  window.matchMedia = original;
  jest.useRealTimers();
});

function DetailFixture() {
  const location = useLocation();
  const detailGo = useDetailTransition();
  return <main data-page-transition-source><header data-site-header>Studio menu</header><div data-testid="detail-route">{location.pathname}</div>
    <button onClick={() => detailGo('/works/one', 'First work', { from: '/' }, '40 × 50 cm, Oil on canvas, 2024')}>Open artwork</button>
    <button onClick={() => detailGo('/', null)}>Return</button>
  </main>;
}

test('detail enters from left and return enters from right', () => {
  jest.useFakeTimers();
  const original = window.matchMedia;
  window.matchMedia = () => ({ matches: false });
  try {
    render(<MemoryRouter initialEntries={['/']}><PageTransitionProvider><DetailFixture /></PageTransitionProvider></MemoryRouter>);
    screen.getByRole('main').scrollTop = 420;
    fireEvent.click(screen.getByRole('button', { name: 'Open artwork' }));
    expect(screen.getAllByTestId('detail-route')[0].textContent).toBe('/works/one');
    expect(screen.getByTestId('outgoing-page').getAttribute('data-direction')).toBe('forward');
    expect(screen.getByTestId('outgoing-page').querySelector('main').scrollTop).toBe(420);
    expect(screen.getByTestId('fixed-transition-header').textContent).toBe('Studio menu');
    expect(screen.queryByRole('status')).toBeNull();
    act(() => jest.advanceTimersByTime(1800));
    expect(screen.queryByTestId('outgoing-page')).toBeNull();
    expect(screen.queryByTestId('fixed-transition-header')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Return' }));
    expect(screen.getAllByTestId('detail-route')[0].textContent).toBe('/');
    expect(screen.getByTestId('outgoing-page').getAttribute('data-direction')).toBe('back');
    expect(screen.getByTestId('fixed-transition-header').textContent).toBe('Studio menu');
    act(() => jest.advanceTimersByTime(1800));
    expect(screen.queryByTestId('outgoing-page')).toBeNull();
    expect(screen.queryByTestId('fixed-transition-header')).toBeNull();
  } finally {
    window.matchMedia = original;
    jest.useRealTimers();
  }
});
