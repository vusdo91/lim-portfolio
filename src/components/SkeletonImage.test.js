import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import SkeletonImage from './SkeletonImage';

test('keeps the skeleton until image decoding finishes and resets it for a new source', async () => {
  const { container, rerender } = render(<SkeletonImage src="/first.jpg" alt="작품" />);
  const image = screen.getByAltText('작품');
  let finishDecode;
  image.decode = jest.fn(() => new Promise(resolve => { finishDecode = resolve; }));
  expect(container.querySelector('[data-image-skeleton]')).toBeTruthy();
  expect(image.style.opacity).toBe('0');
  fireEvent.load(image);
  expect(container.querySelector('[data-image-skeleton]')).toBeTruthy();
  await act(async () => { finishDecode(); });
  expect(container.querySelector('[data-image-skeleton]')).toBeNull();
  expect(image.style.opacity).toBe('');
  rerender(<SkeletonImage src="/second.jpg" alt="작품" />);
  expect(container.querySelector('[data-image-skeleton]')).toBeTruthy();
  expect(image.style.opacity).toBe('0');
});

test('shows a failure message and ends loading when the image fails', () => {
  render(<SkeletonImage src="/missing.jpg" alt="작품" />);
  fireEvent.error(screen.getByAltText('작품'));
  expect(screen.getByRole('status').textContent).toBe('이미지를 불러올 수 없습니다.');
  expect(screen.getByAltText('작품').parentElement.getAttribute('aria-busy')).toBe('false');
});

test('keeps a loaded image skeleton until the gallery reveal sequence permits it', () => {
  const { container, rerender } = render(<SkeletonImage src="/image.jpg" alt="작품" pending />);
  fireEvent.load(screen.getByAltText('작품'));
  expect(container.querySelector('[data-image-skeleton]')).toBeTruthy();
  rerender(<SkeletonImage src="/image.jpg" alt="작품" pending={false} />);
  expect(container.querySelector('[data-image-skeleton]')).toBeNull();
});
