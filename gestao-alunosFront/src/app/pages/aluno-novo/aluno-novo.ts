import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlunoCadastro } from '../../models/aluno-cadastro';
import { ErroValidacao } from '../../models/erro-validacao';
import { AlunoService } from '../../services/aluno.service';
import { cpfValidator } from '../../validators/cpf.validator';
import { AlteracoesPendentes } from '../../guards/alteracoes-pendentes.guard';

const NOME_REGEX = /^[A-Za-zÀ-ÿ '\-]+$/;
const TELEFONE_REGEX = /^\(?[1-9]{2}\)?\s?(?:[2-5]\d{3}|9\d{4})-?\d{4}$/;

@Component({
  selector: 'app-aluno-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aluno-novo.html',
  styleUrl: './aluno-novo.css',
})
export class AlunoNovoComponent implements OnInit, OnDestroy, AlteracoesPendentes {
  private readonly fb = inject(FormBuilder);
  private readonly alunoService = inject(AlunoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly subscription = new Subscription();

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120), Validators.pattern(NOME_REGEX)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    cpf: ['', [Validators.required, cpfValidator]],
    telefone: ['', [Validators.required, Validators.pattern(TELEFONE_REGEX)]],
  });

  geralErro = '';
  isSubmitting = false;
  possuiAlteracoesPendentes = false;

  private readonly queryParams = { ...this.route.snapshot.queryParams };

  ngOnInit(): void {
    this.subscription.add(
      this.form.valueChanges.subscribe(() => {
        this.possuiAlteracoesPendentes = this.form.dirty;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get nome() {
    return this.form.controls.nome;
  }

  get email() {
    return this.form.controls.email;
  }

  get cpf() {
    return this.form.controls.cpf;
  }

  get telefone() {
    return this.form.controls.telefone;
  }

  salvar(): void {
    this.form.markAllAsTouched();
    this.geralErro = '';

    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.limparErroServidor();

    const dados = this.form.getRawValue() as AlunoCadastro;

    this.alunoService.cadastrar(dados).subscribe({
      next: (aluno) => {
        this.isSubmitting = false;
        this.possuiAlteracoesPendentes = false;
        window.alert(`Aluno cadastrado com sucesso. Matrícula: ${aluno.matricula}`);
        void this.router.navigate(['/pagina-inicial'], { queryParams: this.queryParams });
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.possuiAlteracoesPendentes = true;

        if (error.status === 0) {
          this.geralErro = 'Não foi possível conectar ao servidor. Tente novamente.';
          return;
        }

        if (error.status === 422 || error.status === 409) {
          this.aplicarErrosServidor(error.error as ErroValidacao | null);
          return;
        }

        this.geralErro = 'Não foi possível cadastrar o aluno.';
      },
    });
  }

  cancelar(): void {
    if (this.possuiAlteracoesPendentes && !window.confirm('Existem alterações não salvas. Deseja sair sem salvar?')) {
      return;
    }

    this.possuiAlteracoesPendentes = false;
    void this.router.navigate(['/pagina-inicial'], { queryParams: this.queryParams });
  }

  private aplicarErrosServidor(resposta: ErroValidacao | null): void {
    this.limparErroServidor();

    if (!resposta) {
      this.geralErro = 'Não foi possível cadastrar o aluno.';
      return;
    }

    const mensagemGeral = resposta.mensagem?.trim() ?? '';
    const errosSemCampo: string[] = [];

    for (const erro of resposta.erros ?? []) {
      const campo = this.form.get(erro.campo);
      if (!campo) {
        continue;
      }

      const errosAtuais = campo.errors ?? {};
      campo.setErrors({ ...errosAtuais, servidor: erro.mensagem });
      campo.markAsTouched();
    }

    if (resposta.erros?.length) {
      for (const erro of resposta.erros) {
        if (!this.form.get(erro.campo)) {
          errosSemCampo.push(erro.mensagem);
        }
      }
    }

    if (errosSemCampo.length > 0) {
      this.geralErro = errosSemCampo.join(' ');
      return;
    }

    this.geralErro = mensagemGeral || 'Não foi possível cadastrar o aluno.';
  }

  private limparErroServidor(): void {
    for (const control of Object.values(this.form.controls)) {
      if (!control.errors?.['servidor']) {
        continue;
      }

      const { servidor, ...resto } = control.errors;
      control.setErrors(Object.keys(resto).length > 0 ? resto : null);
    }
  }
}