import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8,}$/)]],
    senha: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/)]],
  });

  isSubmitting = false;
  generalError = '';

  constructor() {
    const mensagemSessao = (history.state?.mensagem as string | undefined) ?? '';

    if (mensagemSessao) {
      this.generalError = mensagemSessao;
    }
  }

  get usuario() {
    return this.loginForm.controls.usuario;
  }

  get senha() {
    return this.loginForm.controls.senha;
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    this.generalError = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const { usuario, senha } = this.loginForm.getRawValue();

    this.authService.login(usuario, senha).subscribe({
      next: ({ token, perfil }) => {
        this.authService.salvarSessao(token, perfil, usuario);
        this.isSubmitting = false;
        this.router.navigate(['/pagina-inicial']);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.status === 0) {
          this.generalError = 'Não foi possível conectar ao servidor. Tente novamente.';
          return;
        }

        this.generalError = 'Usuário ou senha inválidos';
      },
    });
  }
}
