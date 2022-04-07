import { Service } from "typedi";
import { PrismaClient, Photo } from "@prisma/client";

@Service()
export class PhotoService {
  constructor(private readonly prisma: PrismaClient) {}

  async getPhoto(id: string): Promise<Photo | null> {
    return this.prisma.photo.findUnique({
      where: {
        id,
      },
    });
  }

  async createPhoto(photo: Photo): Promise<Photo> {
    return this.prisma.photo.create({
      data: photo,
    });
  }
}
