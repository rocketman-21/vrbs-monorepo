import "server-only";

import { Prisma, PrismaClient as DatabaseClient } from "prisma-database";
import { logQuery } from "./log-query";

const isProduction = process.env.NODE_ENV === "production";

const log: Prisma.PrismaClientOptions["log"] = [
  { emit: "event", level: "query" },
  { emit: "stdout", level: "error" },
  { emit: "stdout", level: "info" },
  { emit: "stdout", level: "warn" },
];

const databaseClientSingleton = () => {
  const client = new DatabaseClient({ log });
  client.$on("query" as never, (params: any) => logQuery({ ...params, db: "Revolution" }));

  const extendedClient = client;

  // You can now use typeof extendedClient to refer to this type.
  type ExtendedClientType = typeof extendedClient;
  const returnedClient: ExtendedClientType = extendedClient;

  return returnedClient;
};

type DatabaseClientSingleton = ReturnType<typeof databaseClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  database: DatabaseClientSingleton | undefined;
};

export const database: DatabaseClientSingleton =
  globalForPrisma.database ?? databaseClientSingleton();

// Attach clients to global to avoid issues with hot refresh
if (!isProduction) {
  globalForPrisma.database = database;
}
