export interface Honor {
  title: string;
  issuer: string;
  year: number;
  description: string;
  note?: string;
}

const honors: Honor[] = [
  {
    title: 'Fully Funded PhD Admission',
    issuer: 'University of Connecticut',
    year: 2025,
    description:
      'Admitted to conduct research on data-science applications in manufacturing.',
    note: 'Unable to enroll because the U.S. visa application was denied.',
  },
  {
    title: 'Winner, Third National Competition',
    issuer: "Iran's National Elites Foundation",
    year: 2024,
    description:
      'Recognized for developing a machine-learning model to identify and recommend suitable hydrogen adsorbent materials.',
  },
  {
    title: 'Top 2% Nationwide',
    issuer: 'Iranian University Entrance Exam (Konkur)',
    year: 2018,
    description: 'Ranked in the top 2% among more than 160,000 participants.',
  },
];

export default honors;
