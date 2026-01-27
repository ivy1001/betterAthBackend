import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import type { Auth } from "better-auth";

const db = new Database("./auth.db");

export const auth: Auth = betterAuth({
  baseURL: process.env.BACKEND_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET || "SUPER_SECRET_KEY",
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
}) as Auth;