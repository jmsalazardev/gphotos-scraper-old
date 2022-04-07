import { Service, Inject } from "typedi";
import { Logger } from "winston";
import mimeTypes from "mime-types";
import { AlbumService, GoogleAlbumService } from "../services";
import { PhotoService } from "../services/photo.service";

@Service()
export class AlbumSynchronizer {
  @Inject("Logger")
  private readonly logger: Logger;

  constructor(
    private readonly albumService: AlbumService,
    private readonly photoService: PhotoService,
    private readonly googleAlbumService: GoogleAlbumService
  ) {}

  async execute(input: { url: string }): Promise<void> {
    this.logger.info("getting album data", input);
    const gAlbum = await this.googleAlbumService.getAlbum(input.url);

    if (!gAlbum) {
      this.logger.warn("album not found", input);
      return;
    }

    let album = await this.albumService.getAlbum(gAlbum.id);
    if (album) {
      this.logger.info("album already created", { id: gAlbum.id });
    } else {
      const { id, url, title } = gAlbum;
      album = await this.albumService.createAlbum({
        id,
        url,
        title,
      });

      this.logger.info("album created", { album });
    }

    const { key, items } = gAlbum;
    this.logger.info(`${items.length} items found`);
    for (const item of items) {
      const { id, url } = item;
      const photo = await this.photoService.getPhoto(id);
      if (photo) {
        this.logger.info("photo already imported", { id });
        continue;
      }

      this.logger.info("getting photo metadata", { id });
      const gPhoto = await this.googleAlbumService.getPhoto(id, key);
      if (!gPhoto) {
        this.logger.info("photo metadata not found", { id });
        continue;
      }

      const { id: albumId } = gAlbum;
      const { filename, description, width, height, size, createdAt } = gPhoto;

      const mimeType = `${mimeTypes.lookup(filename)}`;
      const name = filename.replace(/\.[^/.]+$/, "");

      await this.photoService.createPhoto({
        id,
        albumId,
        name,
        mimeType,
        description,
        size,
        width,
        height,
        url,
        createdAt,
      });
      this.logger.info("photo imported", { id });
    }
  }
}
