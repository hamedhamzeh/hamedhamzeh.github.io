import type { LightboxGalleryData } from '@/types/media';

export interface Certificate {
  title: string;
  issuer: string;
  issued: string;
  issuedLabel: string;
  courses?: string[];
  credentialUrl?: string;
  achievement?: string;
  highlights?: string[];
  gallery?: LightboxGalleryData;
  projectUrl?: string;
}

const certificates: Certificate[] = [
  {
    title: 'Task-Oriented Bootcamp in MLOps',
    issuer: 'Quera',
    issued: '2026-09',
    issuedLabel: 'September 2026',
    achievement: 'Completed with a perfect score',
    highlights: [
      'Built reliable data foundations with structured repositories, dependency management, SQL and PostgreSQL, idempotent ETL, schema validation, and pipeline tests.',
      'Created reproducible training workflows with Prefect and managed experiments, artifacts, model packaging, evaluation, and promotion through MLflow.',
      'Developed and tested batch and online inference services with FastAPI, Pydantic, structured logging, Docker, and Docker Compose.',
      // 'Deployed and operated ML workloads on Kubernetes using Helm, CI/CD, autoscaling, health probes, Grafana monitoring, drift detection, retraining, and safe rollbacks.',
    ],
    gallery: {
      triggerLabel: 'View certificate',
      dialogLabel: 'Quera MLOps bootcamp certificate',
      images: [
        {
          src: '/images/assets/MLOps certificate.webp',
          alt: 'Quera certificate awarded to Hamed Hamzeh for completing the Task-Oriented Bootcamp in MLOps with a perfect score',
          width: 2000,
          height: 1414,
          title: 'Task-Oriented Bootcamp in MLOps certificate',
          caption: 'Quera · September 2026',
        },
      ],
    },
    projectUrl: 'https://github.com/hamedhamzeh/mlops-bootcamp',
  },
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
    credentialUrl: 'https://www.coursera.org/share/1202450df425b20459d564ed549e5120',
  },
];

export default certificates;
