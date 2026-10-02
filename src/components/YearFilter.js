import React from 'react';
import styled from 'styled-components';

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.25rem;
`;

const YearButton = styled.button`
  flex: none;
  min-width: 54px;
  height: 28px;
  padding: 0 11px;
  border: 1px solid ${props => props.$active ? '#000' : '#50614f'};
  border-radius: 999px;
  background: ${props => props.$active ? '#000' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#344633'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: 400 11px 'Pretendard Variable', sans-serif;
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;

  &:hover, &:focus-visible {
    border-color: #2050CA;
    background: ${props => props.$active ? '#2050CA' : '#EAF0FF'};
    color: ${props => props.$active ? '#fff' : '#2050CA'};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const getYearOptions = artworks => {
  const years = [...new Set(artworks.map(artwork => String(artwork.year || '').trim()).filter(Boolean))];
  return ['all', ...years.sort((left, right) => Number(left) - Number(right))];
};

const YearFilter = ({ years, selectedYear, onSelect, label = '작품 연도 필터', labels = {} }) => (
  <FilterRow aria-label={label}>
    {years.map(year => (
      <YearButton
        key={year}
        type="button"
        aria-pressed={selectedYear === year}
        $active={selectedYear === year}
        onClick={() => onSelect(year)}
      >
        {labels[year] || (year === 'all' ? 'All' : year)}
      </YearButton>
    ))}
  </FilterRow>
);

export default YearFilter;
