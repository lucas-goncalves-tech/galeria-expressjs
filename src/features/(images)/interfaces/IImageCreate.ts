export interface IImageCreate {
  album_id: string;
  storage_key: string;
  original_name: string;
  thumbnail_key: string | null;
  mime_type: string;
  size: number;
}
