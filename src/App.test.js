import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app shell and redirects to section one', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /section one/i })).toBeInTheDocument();
});
