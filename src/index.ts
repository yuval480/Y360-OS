import express from "express";
import { checkDatabaseConnection, closeDatabaseConnection, pool } from "./db/postgres.js";
import { env } from "./config/env.js";

async function main(): Promise<void> {
  await checkDatabaseConnection();

  const app = express();

  app.get("/", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/test-db", async (_req, res, next) => {
    try {
      const result = await pool.query<{ table_name: string }>(
        "select table_name from information_schema.tables where table_schema = $1 order by table_name",
        ["public"]
      );

      res.json({ tables: result.rows });
    } catch (error) {
      next(error);
    }
  });

  const server = app.listen(env.port, () => {
    console.log(`Service ready on port ${env.port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown();
  });

  process.on("SIGTERM", () => {
    void shutdown();
  });
}

main().catch(async (error) => {
  console.error(error);
  await closeDatabaseConnection();
  process.exit(1);
});
