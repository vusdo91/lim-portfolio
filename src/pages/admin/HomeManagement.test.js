import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomeManagement from './HomeManagement';

const mockArtworks = Array.from({ length: 12 }, (_, index) => ({
  id: `art-${index + 1}`,
  title: `Artwork ${index + 1}`,
  year: index < 6 ? '2025' : '2024',
  image: `/art-${index + 1}.jpg`
}));

jest.mock('../../contexts/ArtworkContext', () => ({
  useArtworks: () => ({ artworks: mockArtworks, isLoading: false })
}));
jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({
    profile: {},
    isLoading: false
  })
}));

const renderPage = () => render(
  <MemoryRouter initialEntries={['/admin/home']}>
    <Routes>
      <Route path="/admin/home" element={<HomeManagement />} />
      <Route path="/admin/home/artworks" element={<p>홈 작품 편집</p>} />
      <Route path="/admin/home/exhibition" element={<p>전시정보 수정</p>} />
      <Route path="/admin/dashboard" element={<p>관리자 대시보드</p>} />
    </Routes>
  </MemoryRouter>
);

test('shows only home artworks and gives the information sections vertical spacing', () => {
  const { container } = renderPage();

  expect(screen.getByText('전시 제목: 늑대, 양, 양배추를 옮기는 방법')).toBeInTheDocument();
  expect(screen.getByText('전시 날짜 표기: 2026. 09. 30 - 2026. 10. 21')).toBeInTheDocument();
  expect(screen.getByText('갤러리·미술관 이름: Gallery Daeheung')).toBeInTheDocument();
  expect(screen.getByText('홈 화면 작품 (10개 선택)')).toBeInTheDocument();
  expect(screen.getByText('Artwork 1 (2025)')).toBeInTheDocument();
  expect(screen.queryByText('Artwork 11 (2024)')).toBeNull();
  const sections = container.querySelectorAll('section');
  expect(sections).toHaveLength(2);
  expect(sections[0].parentElement).toHaveStyle({ gap: '1rem' });
  expect(screen.queryByRole('button', { name: '작품 목록 저장' })).toBeNull();
});

test('opens the exhibition information editor from its edit button', () => {
  renderPage();

  fireEvent.click(screen.getByRole('button', { name: '수정' }));
  expect(screen.getByText('전시정보 수정')).toBeInTheDocument();
});

test('opens the separate artwork list editor from the section header', () => {
  renderPage();

  fireEvent.click(screen.getByRole('button', { name: '편집' }));
  expect(screen.getByText('홈 작품 편집')).toBeInTheDocument();
});
