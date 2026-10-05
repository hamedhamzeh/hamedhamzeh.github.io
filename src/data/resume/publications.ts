import type { LightboxGalleryData } from '@/types/media';

export interface PublicationAuthor {
  name: string;
  citationName: string;
  isHighlighted?: boolean;
}

export interface PublicationPresentation {
  label: string;
  note: string;
  gallery: LightboxGalleryData;
}

export interface Publication {
  title: string;
  image?: string;
  authors: PublicationAuthor[];
  venue?: string;
  year?: number;
  type: 'Conference paper' | 'Journal article' | 'Journal manuscript';
  status: 'Published' | 'Under Review';
  url?: string;
  linkLabel?: string;
  doi?: string;
  /** Route to the publication's dedicated page, when one exists. */
  detailPath?: string;
  presentation?: PublicationPresentation;
}

const publications: Publication[] = [
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
