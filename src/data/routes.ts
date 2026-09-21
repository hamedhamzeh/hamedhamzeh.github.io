export interface Route {
  label: string;
  path: string;
  index?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Hamed Hamzeh',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Resume',
    path: '/resume',
  },
  // Writing and Stats will return to the navigation when their new content is ready.
  {
    label: 'Contact',
    path: '/contact',
  },
  {
    label: 'Archive',
    path: '/projects',
  },
];

export default routes;
