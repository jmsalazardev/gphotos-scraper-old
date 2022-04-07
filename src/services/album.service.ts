import { Service } from "typedi";
import { PrismaClient, Album } from "@prisma/client";

@Service()
export class AlbumService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAlbum(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    return album;
  }

  async createAlbum(album: Album): Promise<Album> {
    return await this.prisma.album.create({
      data: album,
    });
  }
}
