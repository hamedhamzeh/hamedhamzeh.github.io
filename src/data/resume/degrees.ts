export interface Thesis {
  title: string;
  grade: string;
  supervisor: string;
}

export interface Degree {
  school: string;
  degree: string;
  link: string;
  startYear: number;
  endYear: number;
  location?: string;
  gpa?: string;
  thesis?: Thesis;
}

const degrees: Degree[] = [
  {
    school: 'University of Tehran',
    degree: 'B.Sc. in Mechanical Engineering',
    link: 'https://ut.ac.ir/en',
    startYear: 2018,
    endYear: 2023,
    location: 'Tehran, Iran',
    gpa: 'Last two years: 3.48/4',
    thesis: {
      title:
        'Design and Development of a Whole-Body Continuous Passive Motion Device for Neurorehabilitation',
      grade: '18.50/20',
      supervisor: 'Dr. Alireza Daneshmehr',
    },
  },
];

export default degrees;
