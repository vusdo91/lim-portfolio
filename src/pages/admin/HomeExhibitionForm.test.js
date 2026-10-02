import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomeExhibitionForm from './HomeExhibitionForm';

const mockUpdateHomeSettings = jest.fn();
const mockProfile = {
  homeExhibitionTitle: '현재 제목',
  homeExhibitionDate: '2026. 01. 01',
  homeGalleryName: '현재 갤러리',
  homeArtworkIds: ['art-1']
};

jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({ profile: mockProfile, updateHomeSettings: mockUpdateHomeSettings })
}));

test('edits home exhibition information on a separate page without replacing artwork settings', async () => {
  mockUpdateHomeSettings.mockResolvedValue({ success: true });
  render(
    <MemoryRouter initialEntries={['/admin/home/exhibition']}>
      <Routes>
        <Route path="/admin/home/exhibition" element={<HomeExhibitionForm />} />
        <Route path="/admin/home" element={<p>홈 관리</p>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByLabelText('전시 제목')).toHaveValue('현재 제목');
  fireEvent.change(screen.getByLabelText('전시 제목'), { target: { value: '새 제목' } });
  fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

  await waitFor(() => expect(mockUpdateHomeSettings).toHaveBeenCalledWith({
    exhibitionTitle: '새 제목',
    exhibitionDate: '2026. 01. 01',
    galleryName: '현재 갤러리'
  }));
  expect(await screen.findByText('홈 관리')).toBeInTheDocument();
});
