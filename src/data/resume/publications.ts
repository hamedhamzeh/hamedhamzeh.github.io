export interface PublicationAuthor {
  name: string;
  citationName: string;
  isHighlighted?: boolean;
}

export interface Publication {
  title: string;
  authors: PublicationAuthor[];
  venue?: string;
  year?: number;
  type: 'Conference paper' | 'Journal article' | 'Journal manuscript';
  status: 'Published' | 'Under Review';
  url?: string;
  linkLabel?: string;
  doi?: string;
}

const publications: Publication[] = [
  {
    title:
      'A Wormlike Robot for Ferromagnetic Surface Inspection: A Novel System Inspired by Caterpillars',
    authors: [
      { name: 'Parisa Parhami', citationName: 'P. Parhami' },
      {
        name: 'Mohammad Hossein Salehpour',
        citationName: 'M. H. Salehpour',
      },
      {
        name: 'Hamed Hamzeh',
        citationName: 'H. Hamzeh',
        isHighlighted: true,
      },
      { name: 'Rezvan Nasiri', citationName: 'R. Nasiri' },
      { name: 'Hadi Moradi', citationName: 'H. Moradi' },
    ],
    venue: 'IEEE Robotics & Automation Magazine (Early Access)',
    year: 2026,
    type: 'Journal article',
    status: 'Published',
    url: 'https://ieeexplore.ieee.org/document/11551324',
    linkLabel: 'View on IEEE Xplore',
    doi: '10.1109/MRA.2026.3683248',
  },
  {
    title:
      'Design of a Remote Controlled Puppet Robot Imitating a Manual Driven Puppet Using Deep Learning Pose Detection',
    authors: [
      {
        name: 'Hamed Hamzeh',
        citationName: 'H. Hamzeh',
        isHighlighted: true,
      },
      { name: 'Kiarash Shahroozi', citationName: 'K. Shahroozi' },
      { name: 'Ahmad Nabipour', citationName: 'A. Nabipour' },
      { name: 'Parham Kazemi', citationName: 'P. Kazemi' },
      { name: 'Mohammad Malek-Zahedi', citationName: 'M. Malek-Zahedi' },
      { name: 'Mehdi Hallajian', citationName: 'M. Hallajian' },
      { name: 'Hadi Moradi', citationName: 'H. Moradi' },
    ],
    venue: '2024 12th RSI International Conference on Robotics and Mechatronics (ICRoM)',
    year: 2024,
    type: 'Conference paper',
    status: 'Published',
    url: 'https://ieeexplore.ieee.org/document/10903519',
    linkLabel: 'View on IEEE Xplore',
    doi: '10.1109/ICRoM64545.2024.10903519',
  },
  {
    title:
      'Advancing Sustainable Pavement Design: A Data-Driven ML Framework for Predicting the Rheological Performance of Sasobit-Modified Binders',
    authors: [
      {
        name: 'Hamed Hamzeh',
        citationName: 'H. Hamzeh',
        isHighlighted: true,
      },
      { name: 'Parviz Narimani', citationName: 'P. Narimani' },
      {
        name: 'Mohsen Dehghanpour Abyaneh',
        citationName: 'M. Dehghanpour Abyaneh',
      },
    ],
    type: 'Journal manuscript',
    status: 'Under Review',
  },
];

export default publications;
