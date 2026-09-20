import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Honors from '../../Resume/Honors';
import Honor from '../../Resume/Honors/Honor';

const mockHonor = {
  title: 'Research Award',
  issuer: 'Engineering Foundation',
  year: 2025,
  description: 'Recognized for an applied machine-learning project.',
  note: 'Additional context about the award.',
};

describe('Honors', () => {
  it('renders the section title, anchor, and honors', () => {
    render(<Honors data={[mockHonor]} />);

    expect(
      screen.getByRole('heading', { name: 'Honors & Awards' }),
    ).toBeInTheDocument();
    expect(document.getElementById('honors')).toBeInTheDocument();
    expect(screen.getByText(mockHonor.title)).toBeInTheDocument();
  });
});

describe('Honor', () => {
  it('renders the issuer, date, description, and optional note', () => {
    render(<Honor data={mockHonor} />);

    expect(screen.getByText(mockHonor.issuer)).toBeInTheDocument();
    expect(screen.getByText('2025')).toHaveAttribute('datetime', '2025');
    expect(screen.getByText(mockHonor.description)).toBeInTheDocument();
    expect(screen.getByText(mockHonor.note)).toBeInTheDocument();
  });
});
