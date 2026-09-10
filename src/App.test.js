import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the BharatNewz navigation', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'BharatNewz' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
});
