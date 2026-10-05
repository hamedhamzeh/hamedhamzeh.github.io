'use client';

import Markdown from 'markdown-to-jsx';
import SectionNav from '@/components/Navigation/SectionNav';
import { createUniqueHeadingIds } from '@/lib/anchors';

interface AboutContentProps {
  markdown: string;
}

interface AboutSection {
  body: string;
  id: string;
  title: string;
}

interface ParsedAboutSection {
  body: string;
  title: string;
}

const sectionVariants: Record<string, string> = {
  'Fun Facts': 'about-section--compact',
  'I Like': 'about-section--compact',
  'I Dream Of': 'about-section--compact',
  'Websites from People I Admire': 'about-section--links',
};

function splitAboutMarkdown(markdown: string) {
  const trimmed = markdown.trim();
  const introHeading = '# Intro';

  if (!trimmed.startsWith(introHeading)) {
    return {
      intro: '',
      sections: parseSections(trimmed),
    };
  }

  const withoutIntroHeading = trimmed.slice(introHeading.length).trimStart();
  const nextHeadingIndex = withoutIntroHeading.search(/\n# /);

  if (nextHeadingIndex === -1) {
    return {
      intro: withoutIntroHeading.trim(),
      sections: [] as AboutSection[],
    };
  }

  return {
    intro: withoutIntroHeading.slice(0, nextHeadingIndex).trim(),
    sections: parseSections(
      withoutIntroHeading.slice(nextHeadingIndex + 1).trim(),
    ),
  };
}

function parseSections(markdown: string): AboutSection[] {
  const sections: ParsedAboutSection[] = markdown
    .split(/\n(?=# )/)
    .map((section) => section.trim())
    .filter((section) => section !== '')
    .map((section) => {
      const [heading, ...rest] = section.split('\n');

      return {
        title: heading.replace(/^#\s+/, '').trim(),
        body: rest.join('\n').trim(),
      };
    });

  const sectionIds = createUniqueHeadingIds(
    sections.map((section) => section.title),
  );

  return sections.map((section, index) => ({
    ...section,
    id: sectionIds[index] ?? 'section',
  }));
}

function getSectionClassName(title: string) {
  const variant = sectionVariants[title];
  return variant ? `about-section ${variant}` : 'about-section';
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, sections } = splitAboutMarkdown(markdown);

  return (
    <article className="about-content">
      {intro ? (
        <div className="about-intro">
          <Markdown>{intro}</Markdown>
        </div>
      ) : null}
      {sections.length > 0 ? (
        <SectionNav
          items={sections.map(({ id, title }) => ({ id, name: title }))}
          ariaLabel="About sections"
          initialActiveId={sections[0]?.id}
        />
      ) : null}
      {sections.map((section) => (
        <section
          key={section.id}
          className={getSectionClassName(section.title)}
        >
          <h2 id={section.id} className="section-title">
            {section.title}
          </h2>
          <Markdown>{section.body}</Markdown>
        </section>
      ))}
    </article>
  );
}
