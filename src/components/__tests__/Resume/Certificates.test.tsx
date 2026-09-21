import { fireEvent, render, screen } from '@testing-library/react';
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

const mockBootcamp = {
  title: 'Task-Oriented Bootcamp in MLOps',
  issuer: 'Quera',
  issued: '2026-09',
  issuedLabel: 'September 2026',
  achievement: 'Completed with a perfect score',
  highlights: [
    'Built reliable data foundations.',
    'Created reproducible training workflows.',
    'Developed tested inference services.',
    'Deployed ML workloads on Kubernetes.',
  ],
  gallery: {
    triggerLabel: 'View certificate',
    dialogLabel: 'Quera MLOps bootcamp certificate',
    images: [
      {
        src: '/images/assets/MLOps certificate.webp',
        alt: 'Quera MLOps bootcamp certificate',
        width: 2000,
        height: 1414,
      },
    ],
  },
  projectUrl: 'https://github.com/example/mlops-project',
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

  it('renders the bootcamp highlights, certificate lightbox, and project link', () => {
    render(<Certificate data={mockBootcamp} />);

    expect(
      screen.getByText('Completed with a perfect score'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Built reliable data foundations.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Deployed ML workloads on Kubernetes.'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Curriculum highlights').children,
    ).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: 'View certificate' }));
    expect(
      screen.getByRole('dialog', {
        name: 'Quera MLOps bootcamp certificate',
      }),
    ).toBeInTheDocument();

    const projectLink = screen.getByRole('link', {
      name: /view project on github/i,
    });
    expect(projectLink).toHaveAttribute('href', mockBootcamp.projectUrl);
    expect(projectLink).toHaveAttribute('target', '_blank');
    expect(projectLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
