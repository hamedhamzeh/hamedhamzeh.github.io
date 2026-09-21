import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Certificates from '../../Resume/Certificates';
import Certificate from '../../Resume/Certificates/Certificate';

const mockCertificate = {
  title: 'Machine Learning Specialization',
  issuer: 'Coursera',
  issued: '2023-05',
  issuedLabel: 'May 2023',
  courses: ['Supervised Learning', 'Advanced Learning Algorithms'],
  credentialUrl: 'https://example.com/credential',
};

describe('Certificates', () => {
  it('renders the section title, anchor, and certificates', () => {
    render(<Certificates data={[mockCertificate]} />);

    expect(
      screen.getByRole('heading', { name: 'Certificates' }),
    ).toBeInTheDocument();
    expect(document.getElementById('certificates')).toBeInTheDocument();
    expect(screen.getByText(mockCertificate.title)).toBeInTheDocument();
  });
});

describe('Certificate', () => {
  it('renders certificate metadata and included courses', () => {
    render(<Certificate data={mockCertificate} />);

    expect(screen.getByText(mockCertificate.issuer)).toBeInTheDocument();
    expect(screen.getByText('May 2023')).toHaveAttribute('datetime', '2023-05');
    expect(screen.getByText('Supervised Learning')).toBeInTheDocument();
    expect(
      screen.getByText('Advanced Learning Algorithms'),
    ).toBeInTheDocument();
  });

  it('opens the credential safely in a new tab', () => {
    render(<Certificate data={mockCertificate} />);

    const link = screen.getByRole('link', { name: /view credential/i });
    expect(link).toHaveAttribute('href', mockCertificate.credentialUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
