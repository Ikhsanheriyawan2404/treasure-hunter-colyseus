import { PrismaClient } from "@prisma/client"

let db: PrismaClient;

declare namespace global {
  let _db: PrismaClient | undefined;
}

if (!global._db) {
  global._db = new PrismaClient();
}

db = global._db;

export { db };
