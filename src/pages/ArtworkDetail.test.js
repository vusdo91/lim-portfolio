import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ArtworkDetail from './ArtworkDetail';

jest.mock('../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [
  { id: 'one', title: 'First work', year: '2024', image: '/one.jpg' },
  { id: 'two', title: 'Second work', year: '2023', image: '/two.jpg' },
  { id: 'three', title: 'Third work', year: '2024', image: '/three.jpg' },
  { id: 'four', title: 'Fourth work', year: '2024', image: '/four.jpg' }
] }) }));

function RouteLocation() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function show(state) {
  return render(<MemoryRouter initialEntries={[{ pathname: '/works/one', state }]}>
    <RouteLocation />
    <Routes><Route path="/works/:artworkId" element={<ArtworkDetail />} /></Routes>
  </MemoryRouter>);
}

test('Works year filter determines previous and next artwork order', () => {
  jest.useFakeTimers();
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: false });
  try {
    show({ from: '/works', selectedYear: '2024' });
    const progress = screen.getByRole('progressbar', { name: '작품 탐색 진행률' });
    expect(progress.getAttribute('aria-valuenow')).toBe('1');
    expect(progress.getAttribute('aria-valuemax')).toBe('3');
    expect(screen.getByText('다음 작품 2개 남음')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '이전 작품 없음' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '다음 작품: Third work' }));
    expect(screen.getByTestId('location').textContent).toBe('/works/three');
    expect(progress.getAttribute('aria-valuenow')).toBe('2');
    expect(screen.getByAltText('First work')).toBeTruthy();
    expect(screen.getByAltText('Third work')).toBeTruthy();
    expect(screen.getByRole('button', { name: '다음 작품: Fourth work' }).disabled).toBe(true);
    act(() => jest.advanceTimersByTime(760));
    expect(screen.queryByAltText('First work')).toBeNull();
    expect(screen.getByRole('button', { name: '이전 작품: First work' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '다음 작품: Fourth work' })).toBeTruthy();
    expect(screen.getByText('이전 작품 1개 남음')).toBeTruthy();
    expect(screen.getByText('다음 작품 1개 남음')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '다음 작품: Second work' })).toBeNull();
  } finally {
    window.matchMedia = originalMatchMedia;
    jest.useRealTimers();
  }
});

test('All and Home navigation include artworks from every year', () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: true });
  try {
    const view = show({ from: '/works', selectedYear: 'all' });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe('4');
    expect(screen.getByText('다음 작품 3개 남음')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '다음 작품: Second work' }));
    expect(screen.getByTestId('location').textContent).toBe('/works/two');
    view.unmount();
    show({ from: '/' });
    fireEvent.click(screen.getByRole('button', { name: '다음 작품: Second work' }));
    expect(screen.getByTestId('location').textContent).toBe('/works/two');
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});
