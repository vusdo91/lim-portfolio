import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileManagement from './ProfileManagement';
import { DEFAULT_AWARD_ITEMS } from '../../utils/profileDefaults';

const mockUpdateAwardItems = jest.fn();
const mockProfile = {
  biography: '',
  biography_en: '',
  biographyTitle: '',
  biographyTitle_en: '',
  aboutArtworkId: '',
  exhibitions: [
    { id: 1, type: 'solo', year: '2024', name: 'Solo show', name_en: 'Solo show EN' },
    { id: 2, type: 'group', year: '2023', name: 'Group show', name_en: 'Group show EN' }
  ],
  awardItems: DEFAULT_AWARD_ITEMS
};

jest.mock('../../contexts/ProfileContext', () => ({
  useProfile: () => ({
    profile: mockProfile,
    deleteExhibition: jest.fn(),
    updateAwardItems: mockUpdateAwardItems,
    isLoading: false
  })
}));
jest.mock('../../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [] }) }));

test('filters the exhibition list by solo and group type', () => {
  render(<MemoryRouter><ProfileManagement /></MemoryRouter>);

  fireEvent.click(screen.getByRole('button', { name: '개인' }));
  expect(screen.getByText('Solo show')).toBeInTheDocument();
  expect(screen.queryByText('Group show')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: '그룹' }));
  expect(screen.queryByText('Solo show')).toBeNull();
  expect(screen.getByText('Group show')).toBeInTheDocument();
});

test('displays the three current selections as read-only table rows', () => {
  render(<MemoryRouter><ProfileManagement /></MemoryRouter>);

  expect(screen.getByText('선정 목록 (3개)')).toBeInTheDocument();
  expect(screen.getByText(DEFAULT_AWARD_ITEMS[0].content)).toBeInTheDocument();
  expect(screen.getByText(DEFAULT_AWARD_ITEMS[0].content_en)).toBeInTheDocument();
  expect(screen.queryByLabelText(/선정 \d+ 연도/)).toBeNull();
  expect(screen.getByRole('button', { name: '선정 1 수정' })).toBeInTheDocument();
});
