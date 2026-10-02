import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import SiteHeader from './SiteHeader';

test('uses the new navigation and toggles Ko and En with the language icon', () => {
  jest.useFakeTimers();
  render(<MemoryRouter initialEntries={['/about']}><LanguageProvider><SiteHeader /></LanguageProvider></MemoryRouter>);
  expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'About' }).getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('img', { name: 'STUDIO LIM YUN MOOK' }).getAttribute('src')).toContain('logo_studioLimyunmook.svg');
  const toggle = screen.getByRole('button', { name: 'English로 전환' });
  expect(toggle.textContent).toBe('Ko');
  expect(toggle.querySelector('svg')).toBeTruthy();
  fireEvent.click(toggle);
  expect(toggle.textContent).toBe('Ko');
  expect(toggle.disabled).toBe(true);
  act(() => jest.advanceTimersByTime(220));
  expect(screen.getByRole('button', { name: '한국어로 전환' }).textContent).toBe('En');
  fireEvent.click(screen.getByRole('button', { name: '한국어로 전환' }));
  act(() => jest.advanceTimersByTime(220));
  expect(screen.getByRole('button', { name: 'English로 전환' }).textContent).toBe('Ko');
  jest.useRealTimers();
});
