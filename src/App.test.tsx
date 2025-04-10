import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Todo App - Core Functionality', () => {
  it('adds a task to the list', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    
    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.submit(input);

    expect(screen.getByText('Test Task')).toBeTruthy();
  });
});
