import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BiographyEdit from './BiographyEdit';

const mockUpdateBiography = jest.fn();
jest.mock('../../contexts/ProfileContext', () => ({ useProfile: () => ({
  profile: { biography: '기존 소개글', biography_en: '', biographyTitle: '', biographyTitle_en: '', aboutArtworkId: '' },
  updateBiography: mockUpdateBiography
}) }));
jest.mock('../../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [
  { id: 'art-1', title: '선택 가능한 작품', year: '2024', image: '/art-1.jpg' }
] }) }));

test('saves the title and selected registered artwork with the existing biography', async () => {
  mockUpdateBiography.mockResolvedValue({ success: true });
  render(<MemoryRouter initialEntries={['/admin/profile/biography/edit']}><Routes>
    <Route path="/admin/profile/biography/edit" element={<BiographyEdit />} />
    <Route path="/admin/profile" element={<p>프로필 관리</p>} />
  </Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('About 대표 작품'), { target: { value: 'art-1' } });
  fireEvent.change(screen.getByLabelText('소개글 제목 (한국어)'), { target: { value: '새 소개 제목' } });
  fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
  await waitFor(() => expect(mockUpdateBiography).toHaveBeenCalledWith('기존 소개글', '', {
    biographyTitle: '새 소개 제목',
    biographyTitle_en: '',
    aboutArtworkId: 'art-1'
  }));
  await waitFor(() => expect(screen.getByText('프로필 관리')).toBeTruthy());
});
