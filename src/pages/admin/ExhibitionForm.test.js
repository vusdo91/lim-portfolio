import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExhibitionForm from './ExhibitionForm';

const mockExhibitions = [];
jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({
    profile: { exhibitions: mockExhibitions },
    addExhibition: jest.fn(),
    updateExhibition: jest.fn()
  })
}));

test('keeps exhibition edits on the page when navigation is declined', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
  render(
    <MemoryRouter initialEntries={['/admin/profile/exhibition/add']}>
      <Routes>
        <Route path="/admin/profile/exhibition/add" element={<ExhibitionForm />} />
        <Route path="/admin/profile" element={<p>프로필 관리</p>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText('전시명 (한국어)'), { target: { value: '작성 중인 전시' } });
  fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));

  expect(confirm).toHaveBeenCalled();
  expect(screen.getByLabelText('전시명 (한국어)')).toHaveValue('작성 중인 전시');
  expect(screen.queryByText('프로필 관리')).toBeNull();
  confirm.mockRestore();
});
