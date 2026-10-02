import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.obterToken();
  const isLoginRequest = req.url.includes('/api/auth/login');

  const request = !isLoginRequest && token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLoginRequest) {
        authService.logout();
        void router.navigate(['/login'], {
          state: {
            mensagem: 'Sua sessão expirou. Faça login novamente.',
          },
        });
      }

      return throwError(() => error);
    })
  );
};