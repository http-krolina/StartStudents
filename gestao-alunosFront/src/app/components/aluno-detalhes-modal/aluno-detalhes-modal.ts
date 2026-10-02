import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AlunoDetalhe } from '../../models/aluno-detalhe';
import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-aluno-detalhes-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aluno-detalhes-modal.html',
  styleUrl: './aluno-detalhes-modal.css',
})
export class AlunoDetalhesModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly alunoService = inject(AlunoService);
  private readonly document = inject(DOCUMENT);
  private readonly bodyOverflowOriginal = this.document.body.style.overflow;
  private requestSubscription?: Subscription;

  @Input() alunoId: number | null = null;
  @Output() fechar = new EventEmitter<void>();

  @ViewChild('botaoFecharTopo') private botaoFecharTopo?: ElementRef<HTMLButtonElement>;
  @ViewChild('painelModal') private painelModal?: ElementRef<HTMLElement>;

  aluno: AlunoDetalhe | null = null;
  carregando = false;
  mensagemErro = '';
  mostrarBotaoTentarNovamente = false;

  ngAfterViewInit(): void {
    this.document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.botaoFecharTopo?.nativeElement.focus();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alunoId'] && this.alunoId !== null) {
      this.carregarAluno();
    }
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
    this.document.body.style.overflow = this.bodyOverflowOriginal;
  }

  fecharModal(): void {
    this.fechar.emit();
  }

  tentarNovamente(): void {
    if (this.alunoId !== null) {
      this.carregarAluno();
    }
  }

  tratarTecla(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const elementosFocaveis = this.obterElementosFocaveis();
    if (elementosFocaveis.length === 0) {
      event.preventDefault();
      return;
    }

    const focoAtual = this.document.activeElement;
    const indiceAtual = focoAtual instanceof HTMLElement ? elementosFocaveis.indexOf(focoAtual) : -1;

    if (event.shiftKey) {
      const indiceAnterior = indiceAtual <= 0 ? elementosFocaveis.length - 1 : indiceAtual - 1;
      elementosFocaveis[indiceAnterior].focus();
      event.preventDefault();
      return;
    }

    const indiceSeguinte = indiceAtual === -1 || indiceAtual === elementosFocaveis.length - 1
      ? 0
      : indiceAtual + 1;
    elementosFocaveis[indiceSeguinte].focus();
    event.preventDefault();
  }

  obterUrlFoto(): string {
    return this.aluno?.foto ?? '';
  }

  possuiFoto(): boolean {
    return Boolean(this.aluno?.foto);
  }

  obterIniciais(): string {
    const nome = this.aluno?.nome?.trim() ?? '';
    if (!nome) {
      return 'AL';
    }

    const partes = nome.split(/\s+/).filter(Boolean);
    const primeira = partes[0]?.charAt(0) ?? '';
    const segunda = partes[1]?.charAt(0) ?? partes[0]?.charAt(1) ?? '';
    return (primeira + segunda).toUpperCase();
  }

  formatarCpf(cpf: string): string {
    const numeros = cpf.replace(/\D/g, '').slice(0, 11);
    return numeros
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    const numeros = telefone.replace(/\D/g, '').slice(0, 11);

    if (numeros.length > 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/^(\(\d{2}\) \d{5})(\d)/, '$1-$2');
    }

    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^(\(\d{2}\) \d{4})(\d)/, '$1-$2');
  }

  obterEstadoStatus(): 'ativo' | 'inativo' {
    return this.aluno?.status === 'ATIVO' ? 'ativo' : 'inativo';
  }

  private carregarAluno(): void {
    if (this.alunoId === null) {
      return;
    }

    this.requestSubscription?.unsubscribe();
    this.aluno = null;
    this.mensagemErro = '';
    this.mostrarBotaoTentarNovamente = false;
    this.carregando = true;

    this.requestSubscription = this.alunoService.buscarPorId(this.alunoId).subscribe({
      next: (aluno) => {
        this.aluno = aluno;
        this.carregando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.carregando = false;
        if (error.status === 404) {
          this.mensagemErro = 'Aluno não encontrado.';
          this.mostrarBotaoTentarNovamente = false;
          return;
        }

        this.mensagemErro = 'Não foi possível carregar os dados.';
        this.mostrarBotaoTentarNovamente = true;
      },
    });
  }

  private obterElementosFocaveis(): HTMLElement[] {
    const painel = this.painelModal?.nativeElement;
    if (!painel) {
      return [];
    }

    return Array.from(
      painel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((elemento) => !elemento.hasAttribute('disabled') && elemento.offsetParent !== null);
  }
}
