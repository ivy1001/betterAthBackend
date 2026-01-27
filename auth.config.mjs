import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: "dev-secret-change-me",
  emailAndPassword: { enabled: true },
});
