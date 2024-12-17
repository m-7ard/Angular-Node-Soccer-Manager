import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authToken = localStorage.getItem('auth_token');
        console.log("balls, managed to intercept 8))))")

        if (authToken) {
            const authReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`),
            });
            return next.handle(authReq);
        }

        return next.handle(request);
    }
}