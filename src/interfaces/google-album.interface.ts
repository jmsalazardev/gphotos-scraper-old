import { GoogleAlbumItem } from "./google-album-item.interface";

export interface GoogleAlbum {
  id: string;
  key: string;
  title: string;
  url: string;
  items: GoogleAlbumItem[];
}
