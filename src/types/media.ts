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
