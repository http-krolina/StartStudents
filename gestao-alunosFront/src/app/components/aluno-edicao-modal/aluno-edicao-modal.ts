import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AlunoDetalhe } from '../../models/aluno-detalhe';
import { AlunoEdicao } from '../../models/aluno-edicao';
import { ErroValidacao } from '../../models/erro-validacao';
import { StatusAluno } from '../../models/status-aluno';
import { AlunoService } from '../../services/aluno.service';

const NOME_REGEX = /^[A-Za-zÀ-ÿ '\-]+$/;
const TELEFONE_REGEX = /^\(?[1-9]{2}\)?\s?(?:[2-5]\d{3}|9\d{4})-?\d{4}$/;
const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024;
const REGRAS_FOTO: { invalida: (arquivo: File) => boolean; mensagem: string }[] = [
  { invalida: (arquivo) => !['image/jpeg', 'image/png'].includes(arquivo.type), mensagem: 'A foto deve ser JPEG ou PNG.' },
  { invalida: (arquivo) => arquivo.size > TAMANHO_MAXIMO_FOTO, mensagem: 'A foto deve ter no máximo 5 MB.' },
];

type CampoEditavel = 'nome' | 'email' | 'telefone';

interface ValoresNormalizados {
  nome: string;
  email: string;
  telefone: string;
  status: StatusAluno;
  foto: string | null;
}

function nomeValidator(control: AbstractControl<string>): ValidationErrors | null {
  const valor = (control.value ?? '').trim();
  if (!valor) {
    return { required: true };
  }
  if (valor.length < 3) {
    return { minlength: true };
  }
  if (valor.length > 120) {
    return { maxlength: true };
  }
  return NOME_REGEX.test(valor) ? null : { pattern: true };
}

function emailValidator(control: AbstractControl<string>): ValidationErrors | null {
  const valor = (control.value ?? '').trim();
  if (!valor) {
    return { required: true };
  }
  if (valor.length > 150) {
    return { maxlength: true };
  }
  return Validators.email(new FormControl(valor));
}

function telefoneValidator(control: AbstractControl<string>): ValidationErrors | null {
  const valor = (control.value ?? '').trim();
  if (!valor) {
    return { required: true };
  }
  return TELEFONE_REGEX.test(valor) ? null : { pattern: true };
}

@Component({
  selector: 'app-aluno-edicao-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aluno-edicao-modal.html',
  styleUrls: ['../aluno-detalhes-modal/aluno-detalhes-modal.css', './aluno-edicao-modal.css'],
})
export class AlunoEdicaoModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly alunoService = inject(AlunoService);
  private readonly document = inject(DOCUMENT);
  private readonly bodyOverflowOriginal = this.document.body.style.overflow;
  private carregamentoSubscription?: Subscription;
  private envioSubscription?: Subscription;
  private valoresSubscription?: Subscription;

  @Input() alunoId: number | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<AlunoDetalhe>();

  @ViewChild('botaoFecharTopo') private botaoFecharTopo?: ElementRef<HTMLButtonElement>;
  @ViewChild('painelModal') private painelModal?: ElementRef<HTMLElement>;

  readonly form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [nomeValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [emailValidator] }),
    telefone: new FormControl('', { nonNullable: true, validators: [telefoneValidator] }),
    status: new FormControl<StatusAluno>('ATIVO', { nonNullable: true }),
  });

  aluno: AlunoDetalhe | null = null;
  original: ValoresNormalizados | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mostrarBotaoTentarNovamente = false;
  erroGeral = '';
  confirmandoSaida = false;
  errosServidor: Partial<Record<CampoEditavel, string>> = {};
    fotoAtual: string | null = null;
  erroFoto = '';

  ngAfterViewInit(): void {
    this.document.body.style.overflow = 'hidden';
    setTimeout(() => this.botaoFecharTopo?.nativeElement.focus());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alunoId'] && this.alunoId !== null) {
      this.carregarAluno();
    }
  }

  ngOnDestroy(): void {
    this.carregamentoSubscription?.unsubscribe();
    this.envioSubscription?.unsubscribe();
    this.valoresSubscription?.unsubscribe();
    this.document.body.style.overflow = this.bodyOverflowOriginal;
  }

  @HostListener('document:keydown.escape', ['$event'])
  aoPressionarEscape(event: Event): void {
    event.preventDefault();
    if (this.confirmandoSaida) {
      this.continuarEditando();
      return;
    }
    this.solicitarFechamento();
  }

  // RN-039: com alterações não salvas, pede confirmação antes de sair.
  solicitarFechamento(): void {
    if (this.salvando) {
      return;
    }
    if (this.possuiAlteracoes()) {
      this.confirmandoSaida = true;
      setTimeout(() =>
        this.painelModal?.nativeElement.querySelector<HTMLElement>('[data-foco-confirmacao]')?.focus()
      );
      return;
    }
    this.fechar.emit();
  }

  continuarEditando(): void {
    this.confirmandoSaida = false;
    setTimeout(() => this.botaoFecharTopo?.nativeElement.focus());
  }

  sairSemSalvar(): void {
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

    const elementos = this.obterElementosFocaveis();
    if (elementos.length === 0) {
      event.preventDefault();
      return;
    }

    const foco = this.document.activeElement;
    const indice = foco instanceof HTMLElement ? elementos.indexOf(foco) : -1;
    let proximo: number;
    if (event.shiftKey) {
      proximo = indice <= 0 ? elementos.length - 1 : indice - 1;
    } else {
      proximo = indice === -1 || indice === elementos.length - 1 ? 0 : indice + 1;
    }
    elementos[proximo].focus();
    event.preventDefault();
  }

  mascararTelefone(): void {
    const control = this.form.controls.telefone;
    const formatado = this.formatarTelefone(control.value);
    if (formatado !== control.value) {
      control.setValue(formatado);
    }
  }

  selecionarStatus(status: StatusAluno): void {
    this.form.controls.status.setValue(status);
    this.form.controls.status.markAsDirty();
  }

  // RN-034/035/036: compara com os valores originais normalizados, não com o "dirty" do form.
  possuiAlteracoes(): boolean {
    return Object.keys(this.calcularAlteracoes()).length > 0;
  }

  podeSalvar(): boolean {
    return (
      !this.salvando &&
      this.form.valid &&
      Object.keys(this.errosServidor).length === 0 &&
      this.possuiAlteracoes()
    );
  }

  salvar(): void {
    if (!this.podeSalvar() || this.alunoId === null) {
      return;
    }

    const dados = this.calcularAlteracoes();
    this.salvando = true;
    this.erroGeral = '';
    this.errosServidor = {};

    this.envioSubscription = this.alunoService.atualizar(this.alunoId, dados).subscribe({
      next: (alunoAtualizado) => {
        this.salvando = false;
        this.salvo.emit(alunoAtualizado);
      },
      error: (error: HttpErrorResponse) => {
        this.salvando = false;
        this.tratarErroEnvio(error);
      },
    });
  }

  mensagemCampo(campo: CampoEditavel): string {
    const control = this.form.controls[campo];
    if (this.errosServidor[campo]) {
      return this.errosServidor[campo] as string;
    }
    if (!control.touched && !control.dirty) {
      return '';
    }
    const erros = control.errors;
    if (!erros) {
      return '';
    }

    const mensagens: Record<CampoEditavel, Record<string, string>> = {
      nome: {
        required: 'Informe o nome completo.',
        minlength: 'O nome deve ter pelo menos 3 caracteres.',
        maxlength: 'O nome deve ter no máximo 120 caracteres.',
        pattern: 'Use apenas letras, espaços, hífen e apóstrofo.',
      },
      email: {
        required: 'Informe o e-mail.',
        email: 'Informe um e-mail válido.',
        maxlength: 'O e-mail deve ter no máximo 150 caracteres.',
      },
      telefone: {
        required: 'Informe o telefone.',
        pattern: 'Informe um telefone válido com DDD, ex.: (81) 98102-8382.',
      },
    };

    const chave = Object.keys(erros).find((k) => mensagens[campo][k]);
    return chave ? mensagens[campo][chave] : '';
  }

  obterIniciais(): string {
    const nome = (this.form.controls.nome.value || this.aluno?.nome || '').trim();
    if (!nome) {
      return 'AL';
    }
    const partes = nome.split(/\s+/).filter(Boolean);
    const primeira = partes[0]?.charAt(0) ?? '';
    const segunda = partes[1]?.charAt(0) ?? partes[0]?.charAt(1) ?? '';
    return (primeira + segunda).toUpperCase();
  }

    possuiFoto(): boolean {
    return Boolean(this.fotoAtual);
  }

  aoEscolherFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) {
      return;
    }

    this.erroFoto = REGRAS_FOTO.find((regra) => regra.invalida(arquivo))?.mensagem ?? '';
    if (this.erroFoto) {
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      this.fotoAtual = leitor.result as string;
      this.erroGeral = '';
    };
    leitor.readAsDataURL(arquivo);
  }

  removerFoto(): void {
    this.fotoAtual = null;
    this.erroFoto = '';
  }

  formatarCpf(cpf: string): string {
    return cpf
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    const numeros = telefone.replace(/\D/g, '').slice(0, 11);
    if (numeros.length > 10) {
      return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/^(\(\d{2}\) \d{5})(\d)/, '$1-$2');
    }
    return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/^(\(\d{2}\) \d{4})(\d)/, '$1-$2');
  }

  private normalizarAtuais(): ValoresNormalizados {
    const valores = this.form.getRawValue();
    return {
      nome: valores.nome.trim(),
      email: valores.email.trim().toLowerCase(),
      telefone: valores.telefone.replace(/\D/g, ''),
      status: valores.status,
      foto: this.fotoAtual,
    };
  }

  private calcularAlteracoes(): AlunoEdicao {
    if (!this.original) {
      return {};
    }
    const atuais = this.normalizarAtuais();
    const alteracoes: AlunoEdicao = {};
    if (atuais.nome !== this.original.nome) {
      alteracoes.nome = atuais.nome;
    }
    if (atuais.email !== this.original.email) {
      alteracoes.email = atuais.email;
    }
    if (atuais.telefone !== this.original.telefone) {
      alteracoes.telefone = atuais.telefone;
    }
    if (atuais.status !== this.original.status) {
      alteracoes.status = atuais.status;
    }
        if (atuais.foto !== this.original.foto) {
      alteracoes.foto = atuais.foto ?? '';
    }
    return alteracoes;
  }

  private carregarAluno(): void {
    if (this.alunoId === null) {
      return;
    }

    this.carregamentoSubscription?.unsubscribe();
    this.aluno = null;
    this.original = null;
    this.mensagemErro = '';
    this.mostrarBotaoTentarNovamente = false;
    this.carregando = true;

    this.carregamentoSubscription = this.alunoService.buscarPorId(this.alunoId).subscribe({
      next: (aluno) => {
        this.aluno = aluno;
        this.preencherFormulario(aluno);
        this.carregando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.carregando = false;
        if (error.status === 404) {
          this.mensagemErro = 'Aluno não encontrado';
          return;
        }
        this.mensagemErro =
          error.status === 0
            ? 'Não foi possível conectar ao servidor. Tente novamente.'
            : 'Não foi possível carregar os dados.';
        this.mostrarBotaoTentarNovamente = true;
      },
    });
  }

  private preencherFormulario(aluno: AlunoDetalhe): void {
        this.original = {
      nome: aluno.nome.trim(),
      email: aluno.email.trim().toLowerCase(),
      telefone: aluno.telefone.replace(/\D/g, ''),
      status: aluno.status,
      foto: aluno.foto,
    };
    this.fotoAtual = aluno.foto;
    this.erroFoto = '';

    this.form.reset({
      nome: this.original.nome,
      email: this.original.email,
      telefone: this.formatarTelefone(this.original.telefone),
      status: this.original.status,
    });

    this.valoresSubscription?.unsubscribe();
    this.valoresSubscription = new Subscription();
    this.valoresSubscription.add(this.form.valueChanges.subscribe(() => (this.erroGeral = '')));
    (['nome', 'email', 'telefone'] as CampoEditavel[]).forEach((campo) => {
      this.valoresSubscription?.add(
        this.form.controls[campo].valueChanges.subscribe(() => {
          delete this.errosServidor[campo];
        })
      );
    });
  }

  private tratarErroEnvio(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.erroGeral = 'Não foi possível conectar ao servidor. Tente novamente.';
      return;
    }

    if (error.status === 404) {
      this.aluno = null;
      this.mensagemErro = 'Aluno não encontrado';
      this.mostrarBotaoTentarNovamente = false;
      return;
    }

    if (error.status === 409 || error.status === 422) {
      const corpo = error.error as Partial<ErroValidacao> | null;
      let mapeou = false;

            for (const item of corpo?.erros ?? []) {
        if (item.campo === 'nome' || item.campo === 'email' || item.campo === 'telefone') {
          this.errosServidor[item.campo] = item.mensagem;
          mapeou = true;
        } else if (item.campo === 'foto') {
          this.erroFoto = item.mensagem;
          mapeou = true;
        }
      }

      if (!mapeou) {
        this.erroGeral = corpo?.mensagem ?? 'Não foi possível salvar as alterações.';
      }
      return;
    }

    if (error.status !== 401) {
      this.erroGeral = 'Não foi possível salvar as alterações. Tente novamente.';
    }
  }

  private obterElementosFocaveis(): HTMLElement[] {
    const painel = this.painelModal?.nativeElement;
    if (!painel) {
      return [];
    }

    return Array.from(
      painel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
  }
}
