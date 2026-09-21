export interface Certificate {
  title: string;
  issuer: string;
  issued: string;
  issuedLabel: string;
  courses: string[];
  credentialUrl: string;
}

const certificates: Certificate[] = [
  {
    title: 'Machine Learning Specialization',
    issuer: 'Coursera',
    issued: '2023-05',
    issuedLabel: 'May 2023',
    courses: [
      'Supervised Machine Learning: Regression and Classification',
      'Advanced Learning Algorithms',
      'Unsupervised Learning, Recommenders, Reinforcement Learning',
    ],
    credentialUrl:
      'https://www.coursera.org/share/1202450df425b20459d564ed549e5120',
  },
];

export default certificates;
