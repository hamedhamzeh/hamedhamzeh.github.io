export interface Thesis {
  title: string;
  grade: string;
  supervisor: string;
  context?: string;
  projectUrl?: string;
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
      title: 'Design of the Knee and Shoulder Joint Physiotherapy Device',
      grade: '18.50/20',
      supervisor: 'Dr. Alireza Daneshmehr',
      context:
        'Part of a collaborative whole-body rehabilitation device project; my contribution focused on mechanical design and analysis.',
      projectUrl: '/projects/whole-body-rehabilitation-device/',
    },
  },
];

export default degrees;
