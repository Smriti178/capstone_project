import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the bookstore app without crashing', () => {
  render(<App />);
  // App wraps providers + router; just verify it mounts
  expect(document.body).toBeTruthy();
});
