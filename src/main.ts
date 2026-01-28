import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { auth } from './auth/better-auth';
import { toNodeHandler } from 'better-auth/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // ✅ Intercept Better Auth responses and fix cookies
  app.use('/api/auth', (req, res, next) => {
    const originalSetHeader = res.setHeader.bind(res);
    
    res.setHeader = function(name: string, value: any) {
      if (name.toLowerCase() === 'set-cookie' && process.env.NODE_ENV === 'production') {
        // Force SameSite=None for production
        if (Array.isArray(value)) {
          value = value.map(cookie => cookie.replace(/SameSite=Lax/gi, 'SameSite=None'));
        } else if (typeof value === 'string') {
          value = value.replace(/SameSite=Lax/gi, 'SameSite=None');
        }
      }
      return originalSetHeader(name, value);
    };
    
    next();
  }, toNodeHandler(auth));

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, "0.0.0.0");

  console.log(`✅ Server running on port ${port}`);
}
bootstrap();