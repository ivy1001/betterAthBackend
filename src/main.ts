import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { auth } from './auth/better-auth.js';
import { toNodeHandler } from 'better-auth/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Next.js frontend
    credentials: true, // VERY IMPORTANT
  });

  // ✅ Use Better Auth with Node adapter
  app.use('/api/auth', toNodeHandler(auth));

  await app.listen(3001, '0.0.0.0');
  console.log('Server running on http://localhost:3001');
}
bootstrap();