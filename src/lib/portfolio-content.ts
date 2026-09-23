import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import legacyProjects, { type Project } from '@/data/projects';
import legacyPublications, {
  type Publication,
  type PublicationAuthor,
} from '@/data/resume/publications';
import type { LightboxImage } from '@/types/media';

export interface PortfolioMedia {
  images?: Record<string, LightboxImage>;
  galleries?: Record<string, LightboxImage[]>;
}

export interface PublicationDetail extends Publication {
  slug: string;
  description: string;
  content: string;
  media: PortfolioMedia;
  detailPath: string;
}

export interface ProjectDetail extends Project {
  slug: string;
  content: string;
  media: PortfolioMedia;
  link: string;
}

type ContentKind = 'publications' | 'projects';

function contentDirectory(kind: ContentKind): string {
  return path.join(process.cwd(), 'content', kind);
}

export function getDetailSlugs(kind: ContentKind): string[] {
  const directory = contentDirectory(kind);
  if (!fs.existsSync(directory)) return [];

  const slugs = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.slice(0, -3))
    .sort();

  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${directory}: invalid Markdown filename "${slug}.md"`);
    }
  }
  return slugs;
}

function readString(value: unknown, field: string, source: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${source}: ${field} must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(
  value: unknown,
  field: string,
  source: string,
): string | undefined {
  return value == null ? undefined : readString(value, field, source);
}

function readDate(value: unknown, source: string): string {
  const date = readString(value, 'date', source);
  const parsed = new Date(date);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`${source}: date must be a valid YYYY-MM-DD value`);
  }
  return date;
}

function record(
  value: unknown,
  field: string,
  source: string,
): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${source}: ${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function readImage(
  value: unknown,
  field: string,
  source: string,
): LightboxImage {
  const data = record(value, field, source);
  const src = readString(data.src, `${field}.src`, source);
  const alt = readString(data.alt, `${field}.alt`, source);
  const width = data.width;
  const height = data.height;

  if (!src.startsWith('/images/') || src.includes('..')) {
    throw new Error(`${source}: ${field}.src must be a local /images/ path`);
  }
  if (
    typeof width !== 'number' ||
    !Number.isInteger(width) ||
    width <= 0 ||
    typeof height !== 'number' ||
    !Number.isInteger(height) ||
    height <= 0
  ) {
    throw new Error(
      `${source}: ${field} needs positive integer width and height`,
    );
  }

  return {
    src,
    alt,
    width,
    height,
    title: optionalString(data.title, `${field}.title`, source),
    caption: optionalString(data.caption, `${field}.caption`, source),
  };
}

function readMedia(
  value: unknown,
  content: string,
  source: string,
): PortfolioMedia {
  const data = value == null ? {} : record(value, 'media', source);
  const images: Record<string, LightboxImage> = {};
  const galleries: Record<string, LightboxImage[]> = {};

  if (data.images != null) {
    for (const [id, image] of Object.entries(
      record(data.images, 'media.images', source),
    )) {
      images[id] = readImage(image, `media.images.${id}`, source);
    }
  }
  if (data.galleries != null) {
    for (const [id, gallery] of Object.entries(
      record(data.galleries, 'media.galleries', source),
    )) {
      if (!Array.isArray(gallery) || gallery.length < 2) {
        throw new Error(
          `${source}: media.galleries.${id} needs at least two images`,
        );
      }
      galleries[id] = gallery.map((image, index) =>
        readImage(image, `media.galleries.${id}[${index}]`, source),
      );
    }
  }

  for (const match of content.matchAll(
    /<(ImageBlock|Gallery)\s+id=["']([^"']+)["']\s*\/>/g,
  )) {
    const [, component, id] = match;
    const exists = component === 'ImageBlock' ? images[id] : galleries[id];
    if (!exists)
      throw new Error(
        `${source}: ${component} references missing media id "${id}"`,
      );
  }

  return { images, galleries };
}

function readMarkdown(
  kind: ContentKind,
  slug: string,
): { data: Record<string, unknown>; content: string; source: string } | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const source = path.join(contentDirectory(kind), `${slug}.md`);
  if (!fs.existsSync(source)) return null;
  const parsed = matter(fs.readFileSync(source, 'utf8'));
  return { data: parsed.data, content: parsed.content.trim(), source };
}

export function getPublicationBySlug(slug: string): PublicationDetail | null {
  const entry = readMarkdown('publications', slug);
  if (!entry) return null;
  const { data, content, source } = entry;
  if (!Array.isArray(data.authors) || data.authors.length === 0) {
    throw new Error(`${source}: authors must contain at least one author`);
  }
  const authors: PublicationAuthor[] = data.authors.map(
    (value: unknown, index: number) => {
      const author = record(value, `authors[${index}]`, source);
      return {
        name: readString(author.name, `authors[${index}].name`, source),
        citationName: readString(
          author.citationName,
          `authors[${index}].citationName`,
          source,
        ),
        isHighlighted: author.isHighlighted === true,
      };
    },
  );
  const type = readString(data.type, 'type', source);
  const status = readString(data.status, 'status', source);
  if (
    !['Conference paper', 'Journal article', 'Journal manuscript'].includes(
      type,
    ) ||
    !['Published', 'Under Review'].includes(status)
  ) {
    throw new Error(`${source}: invalid publication type or status`);
  }
  if (typeof data.year !== 'number' || !Number.isInteger(data.year)) {
    throw new Error(`${source}: year must be an integer`);
  }

  return {
    slug,
    title: readString(data.title, 'title', source),
    description: readString(data.description, 'description', source),
    authors,
    venue: optionalString(data.venue, 'venue', source),
    year: data.year,
    type: type as Publication['type'],
    status: status as Publication['status'],
    url: optionalString(data.url, 'url', source),
    linkLabel: optionalString(data.linkLabel, 'linkLabel', source),
    doi: optionalString(data.doi, 'doi', source),
    image: optionalString(data.image, 'image', source),
    detailPath: `/publications/${slug}/`,
    content,
    media: readMedia(data.media, content, source),
  };
}

export function getAllPublications(): Publication[] {
  const pageBacked = getDetailSlugs('publications').map((slug) => {
    const publication = getPublicationBySlug(slug);
    if (!publication) throw new Error(`Missing publication: ${slug}`);
    return publication;
  });
  const pageByTitle = new Map(
    pageBacked.map((publication) => [publication.title, publication]),
  );
  const retainedLegacy = legacyPublications.map((publication) => {
    const page = pageByTitle.get(publication.title);
    return page ? { ...publication, ...page } : publication;
  });
  const newPages = pageBacked.filter(
    (publication) =>
      !legacyPublications.some((legacy) => legacy.title === publication.title),
  );
  return [...newPages, ...retainedLegacy];
}

export function getProjectBySlug(slug: string): ProjectDetail | null {
  const entry = readMarkdown('projects', slug);
  if (!entry) return null;
  const { data, content, source } = entry;
  const tech = data.tech;
  if (
    tech != null &&
    (!Array.isArray(tech) || tech.some((item) => typeof item !== 'string'))
  ) {
    throw new Error(`${source}: tech must be a list of strings`);
  }
  const featured = data.featured;
  if (featured != null && typeof featured !== 'boolean') {
    throw new Error(`${source}: featured must be a boolean`);
  }

  return {
    slug,
    title: readString(data.title, 'title', source),
    desc: readString(data.description, 'description', source),
    subtitle: optionalString(data.subtitle, 'subtitle', source),
    date: readDate(data.date, source),
    image: optionalString(data.image, 'image', source) ?? '',
    tech: tech as string[] | undefined,
    featured: featured as boolean | undefined,
    link: `/projects/${slug}/`,
    content,
    media: readMedia(data.media, content, source),
  };
}

export function getAllProjects(): Project[] {
  const pageBacked = getDetailSlugs('projects').map((slug) => {
    const project = getProjectBySlug(slug);
    if (!project) throw new Error(`Missing project: ${slug}`);
    return project;
  });
  const pageByTitle = new Map(
    pageBacked.map((project) => [project.title, project]),
  );
  const retainedLegacy = legacyProjects.map(
    (project) => pageByTitle.get(project.title) ?? project,
  );
  const newPages = pageBacked.filter(
    (project) =>
      !legacyProjects.some((legacy) => legacy.title === project.title),
  );
  return [...retainedLegacy, ...newPages];
}
