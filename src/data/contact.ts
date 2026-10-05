import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/hamed-hamzeh',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://github.com/hamedhamzeh',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://www.instagram.com/hamed._.hamzeh/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    link: 'mailto:hamed.hamze2212@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
