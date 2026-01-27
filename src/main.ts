import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { auth } from './auth/better-auth.js';
import { toNodeHandler } from 'better-auth/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // ✅ Better Auth
  app.use('/api/auth', toNodeHandler(auth));

app.use("/api/auth", (req: any, res: any, next: any) => {
  try {
    const originalSetHeader = res.setHeader.bind(res);

    res.setHeader = (name: string, value: any) => {
      // intercept only Set-Cookie
      if (name.toLowerCase() === "set-cookie") {
        const cookies = Array.isArray(value) ? value : [value];

        const rewritten = cookies.map((c: any) => {
          if (typeof c !== "string") return c;
          if (!c.includes("better-auth.session_token")) return c;

          let updated = c.replace(/SameSite=Lax/i, "SameSite=None");
          updated = updated.replace(/SameSite=Strict/i, "SameSite=None");

          if (!/;\s*Secure/i.test(updated)) updated += "; Secure";
          return updated;
        });

        return originalSetHeader(name, rewritten);
      }

      return originalSetHeader(name, value);
    };

    next();
  } catch (e) {
    // never crash the server
    next();
  }
});


  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log('Server running');
}
bootstrap();
