import { checkDatabaseConnection, closeDatabaseConnection } from "./db/postgres.js";
import { env } from "./config/env.js";

async function main(): Promise<void> {
  await checkDatabaseConnection();
  console.log(`Service ready on port ${env.port}`);
}

main().catch(async (error) => {
  console.error(error);
  await closeDatabaseConnection();
  process.exit(1);
});

