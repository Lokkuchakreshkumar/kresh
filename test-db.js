import { db } from './src/db/index.js';
import { users } from './src/db/schema/index.js';

async function run() {
  try {
    const res = await db.select().from(users).limit(1);
    console.log("DB test success", res);
  } catch (e) {
    console.error("DB test error:", e.message);
  }
  process.exit(0);
}
run();
