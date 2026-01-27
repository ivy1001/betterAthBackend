const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "auth.db");
const migrationPath = path.join(
  __dirname,
  "better-auth_migrations",
  "2026-01-26T16-57-28.360Z.sql"
);

console.log("DB:", dbPath);
console.log("Migration:", migrationPath);

const db = new Database(dbPath);
const sql = fs.readFileSync(migrationPath, "utf8");

db.exec(sql);

console.log("✅ Migration applied");
db.close();
