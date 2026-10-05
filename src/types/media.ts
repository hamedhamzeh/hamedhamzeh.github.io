export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  caption?: string;
}

export interface LightboxGalleryData {
  triggerLabel: string;
  dialogLabel: string;
  images: LightboxImage[];
}

export interface VideoCaption {
  src: string;
  language: string;
  label: string;
  default?: boolean;
}

export interface VideoData {
  src: string;
  poster: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
  captions?: VideoCaption[];
  transcript?: string;
}
