#!/usr/bin/env node

import "reflect-metadata";
import { Container } from "typedi";
import clear from "clear";
import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import winston from "winston";

import { SyncCommand } from "./commands";

//#region Dependencies
const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

Container.set(PrismaClient, prisma);
Container.set("Logger", logger);
//#endregion

const {
  env: { npm_package_name, npm_package_version, npm_package_description },
} = process;
const pkg = {
  name: `${npm_package_name}`,
  version: `${npm_package_version}`,
  description: `${npm_package_description}`,
};

clear();

const program = new Command();

program
  .name(pkg.name)
  .version(pkg.version)
  .description(pkg.description)
  .addCommand(SyncCommand)
  .parseAsync()
  .then((cmd) => {
    logger.info("done");
    process.exit(0);
  })
  .catch((reason) => {
    logger.error(reason);
  });
