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

  // ✅ FORCE SameSite=None for BetterAuth session cookie (cross-domain)
  app.use((req: any, res: any, next: any) => {
    const setCookie = res.getHeader?.('set-cookie');
    if (!setCookie) return next();

    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

    const rewritten = cookies.map((c: any) => {
      if (typeof c !== 'string') return c;

      // only touch BetterAuth cookie
      if (!c.includes('better-auth.session_token')) return c;

      let updated = c.replace(/SameSite=Lax/i, 'SameSite=None');
      updated = updated.replace(/SameSite=Strict/i, 'SameSite=None');

      // SameSite=None requires Secure
      if (!/;\s*Secure/i.test(updated)) updated += '; Secure';

      return updated;
    });

    res.setHeader('set-cookie', rewritten);
    next();
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log('Server running');
}
bootstrap();
