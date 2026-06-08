import { db } from './index.js';
import { users } from './schema/users.js';

async function main() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Connection successful! Users in DB:", allUsers);
    process.exit(0);
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

main();
