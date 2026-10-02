import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import SiteHeader from '../components/SiteHeader';

const mount = () => render(<MemoryRouter><ThemeProvider>
  <SiteHeader />
  <Link to="/works">Open works</Link>
</ThemeProvider></MemoryRouter>);

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

test('theme control sits beside language, persists across routes and reloads', () => {
  const { unmount } = mount();
  const toggle = screen.getByRole('button', { name: '다크모드로 전환' });
  expect(toggle.previousElementSibling.getAttribute('aria-label')).toBe('English로 전환');
  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: '라이트모드로 전환' }).getAttribute('aria-pressed')).toBe('true');
  expect(localStorage.getItem('lim-portfolio-theme')).toBe('dark');
  fireEvent.click(screen.getByRole('link', { name: 'Open works' }));
  expect(screen.getByRole('button', { name: '라이트모드로 전환' })).toBeTruthy();
  unmount();
  mount();
  fireEvent.click(screen.getByRole('button', { name: '라이트모드로 전환' }));
  expect(localStorage.getItem('lim-portfolio-theme')).toBe('light');
});

test('mobile header retains theme controls outside the open menu', () => {
  mount();
  fireEvent.click(document.querySelector('[aria-expanded]'));
  const menu = document.querySelector('[aria-label="Mobile navigation"]');
  expect(menu.querySelector('button')).toBeNull();
  const header = document.querySelector('[data-site-header]');
  const toggle = header.querySelector('[aria-pressed]');
  expect(toggle.parentElement.nextElementSibling.hasAttribute('aria-expanded')).toBe(true);
  expect(toggle.previousElementSibling.getAttribute('aria-label')).toBe('English로 전환');
  fireEvent.click(toggle);
  expect([...document.querySelectorAll('[aria-pressed]')].every(button => button.getAttribute('aria-pressed') === 'true')).toBe(true);
  fireEvent(window, new StorageEvent('storage', { key: 'lim-portfolio-theme', newValue: 'light' }));
  expect([...document.querySelectorAll('[aria-pressed]')].every(button => button.getAttribute('aria-pressed') === 'false')).toBe(true);
});

test('theme toggle still works when preference storage is unavailable', () => {
  const read = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Unavailable'); });
  const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Unavailable'); });
  try {
    mount();
    fireEvent.click(screen.getByRole('button', { name: '다크모드로 전환' }));
    expect(screen.getByRole('button', { name: '라이트모드로 전환' })).toBeTruthy();
  } finally {
    read.mockRestore();
    write.mockRestore();
  }
});
