import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AwardForm from './AwardForm';
import { DEFAULT_AWARD_ITEMS } from '../../utils/profileDefaults';

const mockUpdateAwardItems = jest.fn();
const mockProfile = { awardItems: DEFAULT_AWARD_ITEMS };

jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({ profile: mockProfile, updateAwardItems: mockUpdateAwardItems })
}));

test('edits a selection item on a separate page and saves back to profile management', async () => {
  mockUpdateAwardItems.mockResolvedValue({ success: true });
  render(
    <MemoryRouter initialEntries={['/admin/profile/award/edit/award-2023']}>
      <Routes>
        <Route path="/admin/profile/award/edit/:id" element={<AwardForm />} />
        <Route path="/admin/profile" element={<p>프로필 관리</p>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByLabelText('선정 연도')).toHaveValue('2023');
  fireEvent.change(screen.getByLabelText('선정 내용 (한국어)'), { target: { value: '수정한 내용' } });
  fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

  await waitFor(() => expect(mockUpdateAwardItems).toHaveBeenCalledWith([
    { ...DEFAULT_AWARD_ITEMS[0], content: '수정한 내용' },
    DEFAULT_AWARD_ITEMS[1],
    DEFAULT_AWARD_ITEMS[2]
  ]));
  expect(await screen.findByText('프로필 관리')).toBeInTheDocument();
});
