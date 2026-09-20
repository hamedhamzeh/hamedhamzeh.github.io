export interface EvidenceLink {
  label: string;
  url: string;
}

export interface PositionSection {
  title: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
  links?: EvidenceLink[];
}

/**
 * Based on the JSON Resume work shape, with optional subsections for projects
 * or consecutive roles held at the same organization.
 */
export interface Position {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  subsections?: PositionSection[];
  links?: EvidenceLink[];
}

const work: Position[] = [
  {
    name: 'AISoccer Coach',
    position: 'Computer Vision Developer',
    startDate: '2025-08-01',
    highlights: [
      'Develop computer-vision systems for soccer player identification and action recognition.',
      'Build triplet-loss feature-extraction pipelines using ResNet and MobileNet architectures.',
      'Integrated YOLOv8 player detection with a team-classification pipeline that assigned detected players to the correct team with 98% accuracy.',
      'Fine-tune Vision Transformer models for soccer-player action recognition and use Grad-CAM to interpret their predictions.',
    ],
    links: [
      {
        label: 'View AISoccerCoach on the App Store',
        url: 'https://apps.apple.com/us/app/aisoccercoach/id6744994129',
      },
    ],
  },
  {
    name: 'PART AI',
    position: 'Computer Vision Developer',
    startDate: '2026-01-01',
    endDate: '2026-06-01',
    highlights: [
      'Built a prototype computer-vision pipeline for truck detection, tracking, and activity monitoring.',
      'Trained YOLO models to identify phone use and smoking as workplace-safety events.',
      'Prototyped a machine-vision method for monitoring the motion of three-piston industrial pumps.',
    ],
  },
  {
    name: 'ARIS Lab, University of Tehran',
    position: 'Research Assistant',
    url: 'https://aris.ut.ac.ir/en',
    startDate: '2023-09-01',
    endDate: '2025-05-01',
    summary:
      'Conducted applied research in robotics, computer vision, and embedded control under the supervision of Prof. Manouchehr Moradisabzevar.',
    subsections: [
      {
        title: 'Hand Puppeteer Robot',
        highlights: [
          'Designed and fabricated a 3D-printed robotic puppet integrating mechanical design, embedded control, and vision-based interaction.',
          'Programmed a NodeMCU-based control system to process gyroscope measurements and translate gestures into robot movement.',
          'Created and annotated a dataset of 2,000 images containing pose keypoints and bounding boxes.',
          'Trained a YOLOv8 pose-estimation model and integrated its predictions with the robot for vision-based movement control.',
        ],
        links: [
          {
            label: 'Read paper',
            url: 'https://ieeexplore.ieee.org/document/10903519',
          },
          { label: 'Watch demo', url: '/about' },
          // { label: 'View project', url: '/about' },
        ],
      },
      {
        title: 'Silkworm Robot',
        highlights: [
          'Contributed to the design and experimental evaluation of a modular, bio-inspired robot using passive magnetic adhesion for movement on ferromagnetic surfaces.',
          'Designed and fabricated robot components using PLA, TPU, and Plexiglas, and developed an ESP32-based interface for remote operation.',
          'Conducted locomotion experiments across different module speeds and frequencies to evaluate maneuverability and energy efficiency.',
          'Contributed to the resulting research manuscript and experimental analysis.',
        ],
        links: [
          {
            label: 'Read paper',
            url: 'https://ieeexplore.ieee.org/document/11551324',
          },
          { label: 'Watch demo', url: '/about' },
          // { label: 'View project', url: '/about' },
        ],
      },
    ],
  },
  {
    name: 'Ganje',
    position: '',
    url: 'https://ganje.net/en/',
    startDate: '2022-07-01',
    endDate: '2023-06-01',
    subsections: [
      {
        title: 'Junior Front-End Developer',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        highlights: [
          'Developed a React and TypeScript interface that enabled repair technicians to access and manage smart parcel lockers.',
          'Collaborated with front-end and back-end developers through Git-based workflows and code reviews to integrate locker-management features.',
        ],
      },
      {
        title: 'Mechanical Engineer',
        startDate: '2022-07-01',
        endDate: '2023-01-01',
        highlights: [
          'Designed sheet-metal smart lockers and produced CAD models and engineering drawings using SolidWorks and Onshape.',
          'Used COMSOL simulations to evaluate locker components against environmental loads and vandalism risks.',
          'Coordinated designs with manufacturing requirements to support fabrication and assembly.',
        ],
      },
    ],
  },
];

export default work;
