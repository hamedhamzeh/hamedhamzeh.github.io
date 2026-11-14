import type { LightboxGalleryData } from '@/types/media';

export interface Skill {
  title: string;
  category: string[];
  gallery?: LightboxGalleryData;
}

export interface Category {
  name: string;
  color: string;
}

const categoryNames = [
  'Vision',
  'ML & DL',
  'MLOps',
  'Optimization',
  'Programming & Tools',
  'Front-end',
  'Robotics',
  'Mechanical Eng',
  'Languages',
] as const;

const skills: Skill[] = [
  // Computer Vision
  { title: 'Object Detection', category: ['Vision'] },
  { title: 'Multi-Object Tracking', category: ['Vision'] },
  { title: 'Pose Estimation', category: ['Vision'] },
  { title: 'Action Recognition', category: ['Vision'] },
  { title: 'Ultralytics YOLO', category: ['Vision'] },
  { title: 'Model Interpretability', category: ['Vision'] },

  // ML & Deep Learning
  { title: 'PyTorch', category: ['ML & DL'] },
  { title: 'scikit-learn', category: ['ML & DL'] },
  { title: 'Vision Transformers', category: ['ML & DL'] },
  { title: 'Vision-Language Models', category: ['ML & DL'] },
  { title: 'TensorFlow / Keras', category: ['ML & DL'] },

  // MLOps
  { title: 'MLflow', category: ['MLOps'] },
  { title: 'Prefect', category: ['MLOps'] },
  { title: 'DVC', category: ['MLOps'] },
  { title: 'Docker', category: ['MLOps'] },
  { title: 'FastAPI', category: ['MLOps'] },
  { title: 'Workflow Orchestration', category: ['MLOps'] },

  // Model Optimization & Inference
  { title: 'ONNX', category: ['Optimization'] },
  { title: 'TensorRT', category: ['Optimization'] },

  // Programming & Tools
  { title: 'Python', category: ['Programming & Tools'] },
  { title: 'SQL', category: ['Programming & Tools'] },
  { title: 'PostgreSQL', category: ['Programming & Tools'] },
  { title: 'NumPy', category: ['Programming & Tools'] },
  { title: 'pandas', category: ['Programming & Tools'] },
  { title: 'C++', category: ['Programming & Tools'] },
  { title: 'MATLAB', category: ['Programming & Tools'] },
  { title: 'Git', category: ['Programming & Tools'] },
  { title: 'Linux', category: ['Programming & Tools'] },

  // Web Development
  { title: 'React', category: ['Front-end'] },
  { title: 'Next.js', category: ['Front-end'] },
  { title: 'TypeScript', category: ['Front-end'] },
  { title: 'JavaScript', category: ['Front-end'] },

  // Robotics & Embedded Systems
  { title: 'ESP32 / NodeMCU', category: ['Robotics'] },
  { title: 'Arduino', category: ['Robotics'] },
  { title: 'Sensor Integration', category: ['Robotics'] },
  { title: 'Robot Control', category: ['Robotics'] },
  { title: '3D Printing', category: ['Robotics'] },

  // Mechanical Engineering
  { title: 'SolidWorks / Onshape', category: ['Mechanical Eng'] },
  { title: 'Siemens NX', category: ['Mechanical Eng'] },
  { title: 'COMSOL Multiphysics', category: ['Mechanical Eng'] },
  { title: 'Design for Manufacturing', category: ['Mechanical Eng'] },

  // Languages
  { title: 'Persian — Native', category: ['Languages'] },
  {
    title: 'English — IELTS Academic 7.0',
    category: ['Languages'],
    gallery: {
      triggerLabel: 'View score report',
      dialogLabel: 'IELTS score report',
      images: [
        {
          src: '/images/assets/Ielts_Report_Redacted.webp',
          alt: 'Redacted IELTS Academic Test Report Form showing an overall band score of 7.0',
          width: 1425,
          height: 2000,
          title: 'IELTS score report',
        },
      ],
    },
  },
  { title: 'German — A1', category: ['Languages'] },
];

const categories: Category[] = categoryNames.map((name) => ({
  name,
  color: 'var(--color-accent)',
}));

export { categories, skills };
