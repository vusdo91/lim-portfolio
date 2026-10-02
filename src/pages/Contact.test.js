import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Contact from './Contact';

test('contact copies the email and provides tooltips for both icons', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  try {
  render(<Contact />);
  expect(screen.getByRole('heading', { level: 1, name: 'Always happy to connect.' })).toBeTruthy();
  const email = screen.getByRole('button', { name: '메일주소 복사' });
  expect(email.getAttribute('href')).toBeNull();
  expect(email.getAttribute('aria-describedby')).toBe('contact-email-tooltip');
  expect(email.querySelector('[role="tooltip"]').textContent).toBe('메일주소 복사');
  fireEvent.click(email);
  expect(writeText).toHaveBeenCalledWith('vusdo91@gmail.com');
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('메일주소가 복사되었습니다.'));
  writeText.mockRejectedValueOnce(new Error('Permission denied'));
  fireEvent.click(email);
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('복사하지 못했습니다'));
  const instagram = screen.getByRole('link', { name: 'Instagram 방문' });
  expect(instagram.getAttribute('href')).toBe('https://instagram.com/limyunmook');
  expect(instagram.getAttribute('target')).toBe('_blank');
  expect(instagram.getAttribute('rel')).toBe('noopener noreferrer');
  expect(instagram.getAttribute('aria-describedby')).toBe('contact-instagram-tooltip');
  expect(instagram.querySelector('[role="tooltip"]').textContent).toBe('작가 인스타그램 채널로 이동');
  expect(screen.queryByText('instagram.com/limyunmook')).toBeNull();
  expect(screen.queryByText(/Copyright/)).toBeNull();
  } finally {
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else delete navigator.clipboard;
  }
});

test('copy toast disappears after three seconds and repeated clicks restart its timer', async () => {
  jest.useFakeTimers();
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: jest.fn().mockResolvedValue(undefined) } });
  try {
    const { unmount } = render(<Contact />);
    const button = screen.getByRole('button', { name: '메일주소 복사' });
    await act(async () => { fireEvent.click(button); });
    expect(screen.getByRole('status').textContent).toBe('메일주소가 복사되었습니다.');
    act(() => jest.advanceTimersByTime(2000));
    await act(async () => { fireEvent.click(button); });
    act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByRole('status').textContent).toBe('메일주소가 복사되었습니다.');
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('status', { hidden: true }).textContent).toBe('메일주소가 복사되었습니다.');
    await act(async () => { fireEvent.click(button); });
    const timersBeforeUnmount = jest.getTimerCount();
    unmount();
    expect(jest.getTimerCount()).toBe(timersBeforeUnmount - 1);
  } finally {
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else delete navigator.clipboard;
    jest.useRealTimers();
  }
});
