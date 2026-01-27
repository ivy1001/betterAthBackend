const { betterAuth } = require("better-auth");

const auth = betterAuth({
  secret: "dev-secret-change-me",
  emailAndPassword: { enabled: true },
});

module.exports = { auth };
