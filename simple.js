const path = require("path");
const Database = require("better-sqlite3");

// 🔴 IMPORTANT: absolute path
const dbPath = path.join(__dirname, "auth.db");

console.log("Using DB:", dbPath);

const db = new Database(dbPath);

const rows = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();

console.log(rows);

db.close();
