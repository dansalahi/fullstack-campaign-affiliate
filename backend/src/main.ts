import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

// Request logging middleware
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';

  Logger.log(
    `[REQUEST] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    'RequestLogger',
  );

  // Track response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.log(
      `[RESPONSE] ${method} ${originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`,
      'RequestLogger',
    );
  });

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply request logging middleware
  app.use(requestLogger);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      cookie: {
        maxAge: 60000,
      },
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Configure CORS for local development
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Campaign Affiliate API')
      .setDescription('API for Campaign Affiliate Management')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('daniel :: github.com/dansalahi | dan.salahii@gmail.com')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
  Logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
