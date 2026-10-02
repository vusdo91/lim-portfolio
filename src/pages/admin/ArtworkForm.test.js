import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArtworkForm from './ArtworkForm';

const mockArtworks = [];
jest.mock('../../contexts/ArtworkContext', () => ({
  useArtworks: () => ({
    artworks: mockArtworks,
    addArtwork: jest.fn(),
    updateArtwork: jest.fn()
  })
}));
jest.mock('../../utils/imageUpload', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  extractImagePath: jest.fn()
}));

test('keeps artwork edits on the page when navigation is declined', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
  render(
    <MemoryRouter initialEntries={['/admin/artwork/add']}>
      <Routes>
        <Route path="/admin/artwork/add" element={<ArtworkForm />} />
        <Route path="/admin/artwork" element={<p>작품 목록</p>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText('작품 이름'), { target: { value: '작성 중인 작품' } });
  fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));

  expect(confirm).toHaveBeenCalled();
  expect(screen.getByLabelText('작품 이름')).toHaveValue('작성 중인 작품');
  expect(screen.queryByText('작품 목록')).toBeNull();
  confirm.mockRestore();
});
