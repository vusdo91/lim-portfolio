import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomeArtworkForm from './HomeArtworkForm';

const mockUpdateHomeSettings = jest.fn();
const mockArtworks = Array.from({ length: 12 }, (_, index) => ({
  id: `art-${index + 1}`,
  title: `Artwork ${index + 1}`,
  year: index < 6 ? '2025' : '2024',
  image: `/art-${index + 1}.jpg`
}));
const mockProfile = {};

jest.mock('../../contexts/ArtworkContext', () => ({
  useArtworks: () => ({ artworks: mockArtworks, isLoading: false })
}));
jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({
    profile: mockProfile,
    isLoading: false,
    updateHomeSettings: mockUpdateHomeSettings
  })
}));

const renderPage = () => render(
  <MemoryRouter initialEntries={['/admin/home/artworks']}>
    <Routes>
      <Route path="/admin/home/artworks" element={<HomeArtworkForm />} />
      <Route path="/admin/home" element={<p>홈 관리</p>} />
    </Routes>
  </MemoryRouter>
);

test('filters registered artworks by year without clearing hidden selections', () => {
  renderPage();

  expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(10);
  fireEvent.click(screen.getByRole('button', { name: '2024' }));
  expect(screen.getByRole('checkbox', { name: 'Artwork 7' })).toBeChecked();
  expect(screen.queryByRole('checkbox', { name: 'Artwork 1' })).toBeNull();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Artwork 12' }));
  fireEvent.click(screen.getByRole('button', { name: 'All' }));

  expect(screen.getByRole('checkbox', { name: 'Artwork 12' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Artwork 1' })).toBeChecked();
});

test('saves the artwork selection without writing exhibition fields', async () => {
  mockUpdateHomeSettings.mockResolvedValue({ success: true });
  renderPage();

  fireEvent.click(screen.getByRole('checkbox', { name: 'Artwork 12' }));
  fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

  await waitFor(() => expect(mockUpdateHomeSettings).toHaveBeenCalledWith({
    artworkIds: mockArtworks.slice(0, 10).map(artwork => artwork.id).concat('art-12')
  }));
  expect(await screen.findByText('홈 관리')).toBeInTheDocument();
});

test('asks before discarding an unsaved selection change', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
  renderPage();

  fireEvent.click(screen.getByRole('checkbox', { name: 'Artwork 12' }));
  fireEvent.click(screen.getByRole('button', { name: '취소' }));

  expect(confirm).toHaveBeenCalledWith('수정한 내용이 저장되지 않았습니다. 페이지를 이동하시겠습니까?');
  expect(screen.queryByText('홈 관리')).toBeNull();
  confirm.mockRestore();
});
