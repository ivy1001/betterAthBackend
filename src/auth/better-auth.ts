import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database("./auth.db");

export const auth = betterAuth({
  baseURL: process.env.BACKEND_URL || "http://localhost:3001",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  database: db as any,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
  // ✅ Force secure cookies in production
  advanced: {
    useSecureCookies: true,
  },
});