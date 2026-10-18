import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-aluno-exclusao-modal',
  standalone: true,
  templateUrl: './aluno-exclusao-modal.html',
  styleUrl: './aluno-exclusao-modal.css',
})
export class AlunoExclusaoModalComponent implements AfterViewInit, OnDestroy {
  private readonly alunoService = inject(AlunoService);
  private readonly document = inject(DOCUMENT);
  private readonly bodyOverflowOriginal = this.document.body.style.overflow;
  private subscription?: Subscription;

  @Input({ required: true }) alunoId!: number;
  @Input() nome = '';
  @Input() matricula = '';
  @Output() fechar = new EventEmitter<void>();
  @Output() excluido = new EventEmitter<void>();
  @Output() naoEncontrado = new EventEmitter<void>();

  @ViewChild('botaoCancelar') private botaoCancelar?: ElementRef<HTMLButtonElement>;
  @ViewChild('painelModal') private painelModal?: ElementRef<HTMLElement>;

  excluindo = false;
  mensagemErro = '';

  ngAfterViewInit(): void {
    this.document.body.style.overflow = 'hidden';
    setTimeout(() => this.botaoCancelar?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.document.body.style.overflow = this.bodyOverflowOriginal;
  }

  @HostListener('document:keydown.escape', ['$event'])
  aoPressionarEscape(event: Event): void {
    event.preventDefault();
    this.cancelar();
  }

  cancelar(): void {
    if (!this.excluindo) {
      this.fechar.emit();
    }
  }

  confirmar(): void {
    if (this.excluindo) {
      return;
    }

    this.excluindo = true;
    this.mensagemErro = '';

    this.subscription = this.alunoService.excluir(this.alunoId).subscribe({
      next: () => {
        this.excluindo = false;
        this.excluido.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.excluindo = false;
        if (error.status === 404) {
          this.naoEncontrado.emit();
        } else if (error.status === 403) {
          this.mensagemErro = 'Você não tem permissão para esta ação.';
        } else if (error.status === 0) {
          this.mensagemErro = 'Não foi possível conectar ao servidor. Tente novamente.';
        } else if (error.status !== 401) {
          this.mensagemErro = 'Não foi possível excluir o aluno. Tente novamente.';
        }
      },
    });
  }

  tratarTecla(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const elementos = this.obterElementosFocaveis();
    if (elementos.length === 0) {
      event.preventDefault();
      return;
    }

    const foco = this.document.activeElement;
    const indice = foco instanceof HTMLElement ? elementos.indexOf(foco) : -1;
    const proximo = event.shiftKey
      ? (indice <= 0 ? elementos.length - 1 : indice - 1)
      : (indice === -1 || indice === elementos.length - 1 ? 0 : indice + 1);
    elementos[proximo].focus();
    event.preventDefault();
  }

  private obterElementosFocaveis(): HTMLElement[] {
    const painel = this.painelModal?.nativeElement;
    return painel
      ? Array.from(painel.querySelectorAll<HTMLElement>('button:not([disabled])'))
      : [];
  }
}
