import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // To get the token
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (token && isApiUrl) {
      // Clone the request to add the new header.
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      // Pass on the cloned request instead of the original request.
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
