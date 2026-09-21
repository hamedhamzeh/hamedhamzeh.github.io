import type { Metadata } from 'next';

import SectionNav from '@/components/Navigation/SectionNav';
import Certificates from '@/components/Resume/Certificates';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import Honors from '@/components/Resume/Honors';
import Publications from '@/components/Resume/Publications';
import References from '@/components/Resume/References';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import certificates from '@/data/resume/certificates';
import degrees from '@/data/resume/degrees';
import honors from '@/data/resume/honors';
import publications from '@/data/resume/publications';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description:
    "Hamed Hamzeh's resume: AI engineer and applied researcher focused on computer vision, robotics, and deployable machine-learning systems.",
  path: '/resume/',
});

const resumeSections = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Publications', id: 'publications' },
  { name: 'Skills', id: 'skills' },
  { name: 'Honors', id: 'honors' },
  { name: 'Certificates', id: 'certificates' },
  { name: 'References', id: 'references' },
] as const;

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="page-header resume-header">
          <h1 className="page-title">Resume</h1>
          <p className="resume-summary">
            AI engineer and applied researcher focused on computer vision,
            robotics, and deployable machine-learning systems. Currently a
            Computer Vision Developer at AISoccer Coach, building end-to-end
            vision workflows for player identification and action recognition.
            Combines a mechanical-engineering foundation with applied research
            experience to solve real-world problems, with a growing focus on
            reliable model deployment, optimization, orchestration, and
            monitoring.
          </p>
        </header>

        <SectionNav
          items={resumeSections}
          ariaLabel="Resume sections"
          initialActiveId="experience"
        />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="publications" className="resume-section">
            <Publications data={publications} />
          </section>

          <section id="skills" className="resume-section">
            <Skills
              skills={skills}
              categories={categories}
              defaultCategory="Vision"
            />
          </section>

          <section id="honors" className="resume-section">
            <Honors data={honors} />
          </section>

          <section id="certificates" className="resume-section">
            <Certificates data={certificates} />
          </section>

          <section id="references" className="resume-section">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
