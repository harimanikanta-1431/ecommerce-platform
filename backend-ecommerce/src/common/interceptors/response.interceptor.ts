import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ url: string }>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
