import { describe, expect, it } from 'vitest';

import certificates from '../resume/certificates';

describe('certificates data', () => {
  it('contains the confirmed Machine Learning Specialization credential', () => {
    expect(certificates).toHaveLength(2);
    const specialization = certificates.find(
      ({ title }) => title === 'Machine Learning Specialization',
    );

    expect(specialization).toMatchObject({
      title: 'Machine Learning Specialization',
      issuer: 'Coursera',
      issued: '2023-05',
      credentialUrl:
        'https://www.coursera.org/share/1202450df425b20459d564ed549e5120',
    });
  });

  it('contains all three constituent courses', () => {
    const specialization = certificates.find(
      ({ title }) => title === 'Machine Learning Specialization',
    );

    expect(specialization?.courses).toEqual([
      'Supervised Machine Learning: Regression and Classification',
      'Advanced Learning Algorithms',
      'Unsupervised Learning, Recommenders, Reinforcement Learning',
    ]);
  });

  it('contains the Quera MLOps bootcamp and concise curriculum highlights', () => {
    const bootcamp = certificates.find(
      ({ title }) => title === 'Task-Oriented Bootcamp in MLOps',
    );

    expect(bootcamp).toMatchObject({
      title: 'Task-Oriented Bootcamp in MLOps',
      issuer: 'Quera',
      issued: '2026-09',
      achievement: 'Completed with a perfect score',
      projectUrl: 'https://github.com/hamedhamzeh/mlops-bootcamp',
    });
    expect(bootcamp?.highlights).toHaveLength(3);
    expect(bootcamp?.gallery?.images[0]?.src).toBe(
      '/images/assets/MLOps certificate.webp',
    );
  });
});
