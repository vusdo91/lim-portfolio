import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArtworkManagement from './ArtworkManagement';

const mockArtworks = [
  { id: 'first', title: 'First artwork', year: '2025', image: '/first.jpg' },
  { id: 'second', title: 'Second artwork', year: '2024', image: '/second.jpg' }
];

jest.mock('../../contexts/ArtworkContext', () => ({
  useArtworks: () => ({ artworks: mockArtworks, isLoading: false, deleteArtwork: jest.fn() })
}));

test('filters managed artworks by year using the Works year controls', () => {
  render(
    <MemoryRouter>
      <ArtworkManagement />
    </MemoryRouter>
  );

  expect(screen.getByText('First artwork')).toBeInTheDocument();
  expect(screen.getByText('Second artwork')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '2024' }));

  expect(screen.queryByText('First artwork')).toBeNull();
  expect(screen.getByText('Second artwork')).toBeInTheDocument();
});

test('shows the total artwork count above the year filters and places add beside the view toggle', () => {
  const { container } = render(
    <MemoryRouter>
      <ArtworkManagement />
    </MemoryRouter>
  );

  expect(screen.getByText('현재 등록된 작품 수: 2개')).toBeInTheDocument();
  expect(
    screen.getByText('현재 등록된 작품 수: 2개').compareDocumentPosition(
      container.querySelector('[aria-label="작품 연도 필터"]')
    ) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(screen.getByRole('button', { name: '카드 보기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '테이블 보기' })).toBeInTheDocument();

  const addButton = screen.getByRole('button', { name: '작품 추가' });
  expect(addButton.parentElement).toBe(screen.getByRole('button', { name: '테이블 보기' }).parentElement);
});

test('switches to text-only table and previews the hovered artwork image near the pointer', () => {
  const { container } = render(
    <MemoryRouter>
      <ArtworkManagement />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: '테이블 보기' }));
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(container.querySelector('table img')).toBeNull();

  const artworkRow = screen.getByText('First artwork').closest('tr');
  fireEvent.mouseMove(artworkRow, { clientX: 100, clientY: 120 });
  const preview = container.querySelector('img[alt=""]');
  expect(preview).toHaveAttribute('src', '/first.jpg');
  expect(preview).toHaveStyle({ position: 'fixed', left: '116px', top: '136px' });

  fireEvent.mouseLeave(artworkRow);
  expect(container.querySelector('img[alt=""]')).toBeNull();
});

test('keeps the add action available when navigating from the toolbar', () => {
  render(
    <MemoryRouter initialEntries={['/admin/artwork']}>
      <Routes>
        <Route path="/admin/artwork" element={<ArtworkManagement />} />
        <Route path="/admin/artwork/add" element={<p>작품 추가 화면</p>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: '작품 추가' }));
  expect(screen.getByText('작품 추가 화면')).toBeInTheDocument();
});
