import React from 'react';
import { act, render, screen } from '@testing-library/react';
import About from './About';

let mockLanguage = 'ko';
let mockProfileLoading = false;
let mockArtworksLoading = false;
jest.mock('../contexts/LanguageContext', () => ({ useLanguage: () => ({ language: mockLanguage }) }));
jest.mock('../contexts/ProfileContext', () => ({ useProfile: () => ({ profile: {
  biography: '관리자 소개글입니다.\r\n\r\n두 번째 문단입니다.\n세 번째 문단입니다.',
  biography_en: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
  biographyTitle: '소개글 제목',
  aboutArtworkId: 'two',
  exhibitions: []
}, isLoading: mockProfileLoading, syncDefaultData: jest.fn() }) }));
jest.mock('../contexts/ArtworkContext', () => ({ useArtworks: () => ({ artworks: [
  { id: 'one', title: '첫 작품', image: '/one.jpg', year: '2023' },
  { id: 'two', title: '선택한 작품', image: '/two.jpg', size: '40 × 40 cm', material: 'Oil on Canvas', year: '2024' }
], isLoading: mockArtworksLoading }) }));

test.each(['profile', 'artworks'])('waits for %s data before showing the selected artwork on refresh', pending => {
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = undefined;
  mockProfileLoading = true;
  mockArtworksLoading = true;
  try {
    const { rerender } = render(<About />);
    expect(screen.queryByRole('img', { hidden: true })).toBeNull();
    if (pending === 'profile') mockArtworksLoading = false;
    else mockProfileLoading = false;
    rerender(<About />);
    expect(screen.queryByRole('img', { hidden: true })).toBeNull();
    mockProfileLoading = false;
    mockArtworksLoading = false;
    rerender(<About />);
    expect(screen.getByAltText('선택한 작품').getAttribute('src')).toBe('/two.jpg');
    expect(screen.queryByAltText('첫 작품')).toBeNull();
  } finally {
    mockProfileLoading = false;
    mockArtworksLoading = false;
    window.IntersectionObserver = originalObserver;
  }
});

test('language changes animate only visible elements and preserve revealed offscreen elements', () => {
  const originalObserver = window.IntersectionObserver;
  let notify;
  window.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  try {
    const { rerender } = render(<About />);
    const title = screen.getByRole('heading', { level: 1 });
    const artwork = screen.getByAltText('선택한 작품').closest('[data-about-reveal]');
    const lower = screen.getByText('세 번째 문단입니다.');
    const unseen = screen.getByText('두 번째 문단입니다.');
    artwork.dataset.revealed = 'true';
    lower.dataset.revealed = 'true';
    artwork.getBoundingClientRect = () => ({ top: -200, bottom: -100, height: 100 });
    title.getBoundingClientRect = () => ({ top: 100, bottom: 130, height: 30 });
    lower.getBoundingClientRect = () => ({ top: 1200, bottom: 1300, height: 100 });
    unseen.getBoundingClientRect = () => ({ top: 1000, bottom: 1100, height: 100 });
    const cancel = jest.fn();
    title.animate = jest.fn(() => ({ cancel }));
    artwork.animate = jest.fn();
    lower.animate = jest.fn();
    act(() => notify([{ target: title, isIntersecting: true }]));
    expect(title.getAttribute('data-revealed')).toBe('true');
    mockLanguage = 'en';
    rerender(<About />);
    expect(title.getAttribute('data-revealed')).toBe('true');
    expect(title.animate).toHaveBeenCalledTimes(1);
    expect(artwork.getAttribute('data-revealed')).toBe('true');
    expect(lower.getAttribute('data-revealed')).toBe('true');
    expect(lower.isConnected).toBe(true);
    expect(lower.textContent).toBe('Third paragraph.');
    expect(artwork.animate).not.toHaveBeenCalled();
    expect(lower.animate).not.toHaveBeenCalled();
    expect(unseen.getAttribute('data-revealed')).toBeNull();
  } finally {
    mockLanguage = 'ko';
    window.IntersectionObserver = originalObserver;
  }
});

test('uses the selected artwork, administrator title and existing biography', () => {
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = undefined;
  try {
    render(<About />);
    expect(screen.getByAltText('선택한 작품').getAttribute('src')).toBe('/two.jpg');
    expect(screen.getByRole('heading', { level: 1, name: '소개글 제목' })).toBeTruthy();
    expect(screen.getByText('관리자 소개글입니다.')).toBeTruthy();
    expect(screen.getByText('40 × 40 cm, Oil on Canvas, 2024')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'DB 동기화' })).toBeNull();
  } finally {
    window.IntersectionObserver = originalObserver;
  }
});

test('shows the existing default selections on About when profile data has none yet', () => {
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = undefined;
  try {
    render(<About />);
    expect(screen.getByText('청주미술창작스튜디오17기 입주작가')).toBeInTheDocument();
    expect(screen.getByText('온라인 미디어 지원 사업 선정,충북문화재단')).toBeInTheDocument();
    expect(screen.getByText('아트체인지업 지원 사업 선정,한국문화예술위원회')).toBeInTheDocument();
  } finally {
    window.IntersectionObserver = originalObserver;
  }
});

test('reveals visible introduction pieces in order and waits for lower sections', () => {
  jest.useFakeTimers();
  const originalObserver = window.IntersectionObserver;
  let notify;
  const observed = [];
  window.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    observe(element) { observed.push(element); }
    unobserve() {}
    disconnect() {}
  };
  try {
    render(<About />);
    const artwork = screen.getByAltText('선택한 작품').closest('[data-about-reveal]');
    const title = screen.getByRole('heading', { level: 1, name: '소개글 제목' });
    const biography = screen.getByText('관리자 소개글입니다.');
    const secondParagraph = screen.getByText('두 번째 문단입니다.');
    const thirdParagraph = screen.getByText('세 번째 문단입니다.');
    expect(biography.tagName).toBe('P');
    expect(observed).toEqual(expect.arrayContaining([biography, secondParagraph, thirdParagraph]));
    expect(biography.parentElement.hasAttribute('data-about-reveal')).toBe(false);
    const education = observed.find(element => element.textContent.includes('학력'));
    expect(artwork.getAttribute('data-revealed')).toBeNull();
    act(() => notify([artwork, title, biography].map(target => ({ target, isIntersecting: true }))));
    expect(artwork.getAttribute('data-revealed')).toBe('true');
    expect(title.getAttribute('data-revealed')).toBeNull();
    act(() => jest.advanceTimersByTime(120));
    expect(title.getAttribute('data-revealed')).toBe('true');
    act(() => jest.advanceTimersByTime(120));
    expect(biography.getAttribute('data-revealed')).toBe('true');
    act(() => jest.advanceTimersByTime(1000));
    expect(secondParagraph.getAttribute('data-revealed')).toBeNull();
    expect(thirdParagraph.getAttribute('data-revealed')).toBeNull();
    act(() => notify([{ target: secondParagraph, isIntersecting: true }]));
    expect(secondParagraph.getAttribute('data-revealed')).toBe('true');
    expect(thirdParagraph.getAttribute('data-revealed')).toBeNull();
    expect(education.getAttribute('data-revealed')).toBeNull();
    act(() => notify([{ target: education, isIntersecting: true }]));
    act(() => jest.advanceTimersByTime(120));
    expect(education.getAttribute('data-revealed')).toBe('true');
  } finally {
    window.IntersectionObserver = originalObserver;
    jest.useRealTimers();
  }
});
