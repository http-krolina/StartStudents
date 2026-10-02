import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  perfil: 'ADMINISTRADOR' | 'LEITOR';
}

export type PerfilUsuario = AuthResponse['perfil'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly PERFIL_KEY = 'perfil';
  private static readonly LOGIN_KEY = 'login';

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth/login';

  login(login: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { login, senha });
  }

  salvarSessao(token: string, perfil: PerfilUsuario, login: string): void {
    sessionStorage.setItem(AuthService.TOKEN_KEY, token);
    sessionStorage.setItem(AuthService.PERFIL_KEY, perfil);
    sessionStorage.setItem(AuthService.LOGIN_KEY, login);
  }

  logout(): void {
    sessionStorage.removeItem(AuthService.TOKEN_KEY);
    sessionStorage.removeItem(AuthService.PERFIL_KEY);
    sessionStorage.removeItem(AuthService.LOGIN_KEY);
  }

  obterToken(): string | null {
    return sessionStorage.getItem(AuthService.TOKEN_KEY);
  }

  obterPerfil(): PerfilUsuario | null {
    const perfil = sessionStorage.getItem(AuthService.PERFIL_KEY);
    if (perfil === 'ADMINISTRADOR' || perfil === 'LEITOR') {
      return perfil;
    }

    return null;
  }

  obterLogin(): string | null {
    return sessionStorage.getItem(AuthService.LOGIN_KEY);
  }
}
