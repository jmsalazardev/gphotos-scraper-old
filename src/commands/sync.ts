import "reflect-metadata";
import { Container } from "typedi";
import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { AlbumSynchronizer } from "../use-cases/album-synchronizer";

export const SyncCommand = new Command();

SyncCommand.name("sync")
  .description("Sync internal db")
  .argument("<url>", "album shared url")
  .hook("preAction", async () => {
    const prisma = Container.get(PrismaClient);
    await prisma.$connect();
  })
  .hook("postAction", async () => {
    const prisma = Container.get(PrismaClient);
    await prisma.$disconnect();
  })
  .action(async (url) => {
    const albumSynchronizer = Container.get(AlbumSynchronizer);
    return albumSynchronizer.execute({ url });
  });
