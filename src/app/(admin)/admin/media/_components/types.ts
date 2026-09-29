export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  publicId: string;
  size: number;
  usedIn?: string | null;
  createdAt: string;
};
