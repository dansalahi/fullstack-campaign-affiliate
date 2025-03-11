import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // Log the request
    this.logger.log(
      `[REQUEST] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Track response time
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - start;

      // Log the response
      this.logger.log(
        `[RESPONSE] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - Content-Length: ${contentLength || 'unknown'}`,
      );

      // Log errors with more details
      if (statusCode >= 400) {
        this.logger.error(
          `[ERROR] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
          statusCode >= 500 ? 'Internal Server Error' : 'Client Error',
        );
      }
    });

    next();
  }
}
