export interface Skill {
  title: string;
  category: string[];
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
  'Programming',
  'Front-end',
  'Robotics',
  'Mechanical Eng',
  'Tools',
  'Languages',
] as const;

const skills: Skill[] = [
  // Computer Vision
  { title: 'Object Detection', category: ['Vision'] },
  { title: 'Multi-Object Tracking', category: ['Vision'] },
  { title: 'Pose Estimation', category: ['Vision'] },
  { title: 'Action Recognition', category: ['Vision'] },
  { title: 'Feature Extraction', category: ['Vision'] },
  { title: 'Model Interpretability', category: ['Vision'] },

  // ML & Deep Learning
  { title: 'PyTorch', category: ['ML & DL'] },
  { title: 'scikit-learn', category: ['ML & DL'] },
  { title: 'CNNs', category: ['ML & DL'] },
  { title: 'Vision Transformers', category: ['ML & DL'] },
  { title: 'LSTMs', category: ['ML & DL'] },
  { title: 'TensorFlow / Keras', category: ['ML & DL'] },

  // MLOps
  { title: 'MLflow', category: ['MLOps'] },
  { title: 'Prefect', category: ['MLOps'] },
  { title: 'DVC', category: ['MLOps'] },
  { title: 'Docker', category: ['MLOps'] },
  { title: 'FastAPI', category: ['MLOps'] },
  { title: 'Weights & Biases', category: ['MLOps'] },
  { title: 'Experiment Tracking', category: ['MLOps'] },
  { title: 'Workflow Orchestration', category: ['MLOps'] },

  // Model Optimization & Inference
  { title: 'ONNX', category: ['Optimization'] },
  { title: 'TensorRT', category: ['Optimization'] },
  { title: 'Model Conversion', category: ['Optimization'] },

  // Programming & Data
  { title: 'Python', category: ['Programming'] },
  { title: 'C++', category: ['Programming'] },
  { title: 'MATLAB', category: ['Programming'] },
  { title: 'SQL', category: ['Programming'] },
  { title: 'NumPy', category: ['Programming'] },
  { title: 'Pandas', category: ['Programming'] },

  // Web Development
  { title: 'React', category: ['Front-end'] },
  { title: 'Next.js', category: ['Front-end'] },
  { title: 'TypeScript', category: ['Front-end'] },
  { title: 'JavaScript', category: ['Front-end'] },
  { title: 'REST APIs', category: ['Front-end'] },

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
  { title: 'CAD / CAE', category: ['Mechanical Eng'] },
  { title: 'Design for Manufacturing', category: ['Mechanical Eng'] },

  // Development Tools
  { title: 'Git', category: ['Tools'] },
  { title: 'Linux', category: ['Tools'] },

  // Languages
  { title: 'Persian — Native', category: ['Languages'] },
  { title: 'English — IELTS Academic 7.0', category: ['Languages'] },
  { title: 'German — A1', category: ['Languages'] },
];

const categories: Category[] = categoryNames.map((name) => ({
  name,
  color: 'var(--color-accent)',
}));

export { categories, skills };
