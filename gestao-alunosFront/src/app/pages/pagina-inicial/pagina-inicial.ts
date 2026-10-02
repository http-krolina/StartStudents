import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { AlunoLista } from '../../models/aluno-lista';
import { StatusAluno } from '../../models/status-aluno';
import { AlunoDetalhesModalComponent } from '../../components/aluno-detalhes-modal/aluno-detalhes-modal';
import { AlunoService } from '../../services/aluno.service';
import { AuthService } from '../../services/auth';

type OrdenacaoAluno = 'nome' | 'matricula';
type DirecaoOrdenacao = 'asc' | 'desc';
type StatusFiltro = StatusAluno | 'TODOS';
type ItemPaginacao = number | '...';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlunoDetalhesModalComponent],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css',
})
export class PaginaInicialComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly alunoService = inject(AlunoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroy$ = new Subject<void>();

  private loadingDelayId: ReturnType<typeof setTimeout> | null = null;
  private requestSubscription?: Subscription;
  private isApplyingQueryParams = false;
  private lastLoadedQueryKey: string | null = null;
  private ultimoElementoDetalhes: HTMLElement | null = null;

  readonly buscaControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<StatusFiltro>('TODOS', { nonNullable: true });

  alunos: AlunoLista[] = [];
  totalElementos = 0;
  totalPaginas = 0;
  paginaAtual = 0;
  readonly tamanhoPagina = 10;
  ordenarPor: OrdenacaoAluno = 'nome';
  direcao: DirecaoOrdenacao = 'asc';

  carregando = false;
  erroCarregamento = false;
  menuUsuarioAberto = false;
  mensagemAcao = '';
  alunoDetalheSelecionadoId: number | null = null;

  readonly perfil = this.authService.obterPerfil();
  readonly login = this.authService.obterLogin() ?? '';
  readonly statusOptions: Array<{ label: string; value: StatusFiltro }> = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Ativos', value: 'ATIVO' },
    { label: 'Inativos', value: 'INATIVO' },
  ];

  ngOnInit(): void {
    this.inicializarFluxos();
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
    this.limparTemporizadorCarregamento();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: MouseEvent): void {
    const alvo = event.target;
    if (!(alvo instanceof Node)) {
      return;
    }

    const clicouDentroDoMenu = this.elementRef.nativeElement
      .querySelector('.menu-usuario-wrapper')
      ?.contains(alvo);

    if (this.menuUsuarioAberto && !clicouDentroDoMenu) {
      this.menuUsuarioAberto = false;
    }
  }

  @HostListener('document:keydown.escape')
  fecharMenuComEscape(): void {
    this.menuUsuarioAberto = false;
  }

  get isAdministrador(): boolean {
    return this.perfil === 'ADMINISTRADOR';
  }

  get loginExibicao(): string {
    const loginNormalizado = this.login.trim();
    if (!loginNormalizado) {
      return 'Usuário';
    }

    return loginNormalizado.charAt(0).toUpperCase() + loginNormalizado.slice(1);
  }

  get iniciaisAvatar(): string {
    const loginLimpo = this.login.replace(/\s+/g, '');
    return (loginLimpo.slice(0, 2) || 'US').toUpperCase();
  }

  get totalAlunosTexto(): string {
    return this.totalElementos === 1
      ? '1 aluno encontrado'
      : `${this.totalElementos} alunos encontrados`;
  }

  get possuiFiltrosAtivos(): boolean {
    return this.buscaNormalizada().length > 0 || this.statusControl.value !== 'TODOS';
  }

  get paginaAtualExibicao(): number {
    return this.paginaAtual + 1;
  }

  get itensPaginacao(): ItemPaginacao[] {
    if (this.totalPaginas <= 1) {
      return this.totalPaginas === 1 ? [1] : [];
    }

    const paginas = new Set<number>();
    const paginaAtualExibicao = this.paginaAtual + 1;

    paginas.add(1);
    paginas.add(this.totalPaginas);

    for (let pagina = paginaAtualExibicao - 1; pagina <= paginaAtualExibicao + 1; pagina += 1) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        paginas.add(pagina);
      }
    }

    const ordenadas = Array.from(paginas).sort((a, b) => a - b);
    const itens: ItemPaginacao[] = [];

    for (let indice = 0; indice < ordenadas.length; indice += 1) {
      const pagina = ordenadas[indice];
      const anterior = ordenadas[indice - 1];

      if (anterior && pagina - anterior > 1) {
        itens.push('...');
      }

      itens.push(pagina);
    }

    return itens;
  }

  toggleMenuUsuario(event: MouseEvent): void {
    event.stopPropagation();
    this.menuUsuarioAberto = !this.menuUsuarioAberto;
  }

  manterMenuAberto(event: MouseEvent): void {
    event.stopPropagation();
  }

  sair(): void {
    this.authService.logout();
    this.menuUsuarioAberto = false;
    void this.router.navigate(['/login']);
  }

  ordenar(coluna: OrdenacaoAluno): void {
    this.mensagemAcao = '';

    if (this.ordenarPor === coluna) {
      this.direcao = this.direcao === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenarPor = coluna;
      this.direcao = 'asc';
    }

    this.paginaAtual = 0;
    this.atualizarQueryParamsECarregar();
  }

  obterAriaSort(coluna: OrdenacaoAluno): 'ascending' | 'descending' | 'none' {
    if (this.ordenarPor !== coluna) {
      return 'none';
    }

    return this.direcao === 'asc' ? 'ascending' : 'descending';
  }

  obterSetaOrdenacao(coluna: OrdenacaoAluno): string {
    if (this.ordenarPor !== coluna) {
      return '↕';
    }

    return this.direcao === 'asc' ? '↑' : '↓';
  }

  irParaPagina(paginaExibicao: number): void {
    this.mensagemAcao = '';

    const novaPagina = paginaExibicao - 1;
    if (novaPagina < 0 || novaPagina >= this.totalPaginas || novaPagina === this.paginaAtual) {
      return;
    }

    this.paginaAtual = novaPagina;
    this.atualizarQueryParamsECarregar();
  }

  paginaAnterior(): void {
    this.mensagemAcao = '';

    if (this.paginaAtual === 0) {
      return;
    }

    this.paginaAtual -= 1;
    this.atualizarQueryParamsECarregar();
  }

  proximaPagina(): void {
    this.mensagemAcao = '';

    if (this.paginaAtual >= this.totalPaginas - 1) {
      return;
    }

    this.paginaAtual += 1;
    this.atualizarQueryParamsECarregar();
  }

  tentarNovamente(): void {
    this.mensagemAcao = '';
    this.carregarAlunos();
  }

  limparFiltros(): void {
    this.mensagemAcao = '';
    this.buscaControl.setValue('', { emitEvent: false });
    this.statusControl.setValue('TODOS', { emitEvent: false });
    this.paginaAtual = 0;
    this.atualizarQueryParamsECarregar();
  }

  novoAluno(): void {
    void this.router.navigate(['/alunos/novo'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  verDetalhes(id: number): void {
    const alvo = this.document.activeElement;
    this.ultimoElementoDetalhes = alvo instanceof HTMLElement ? alvo : null;
    this.alunoDetalheSelecionadoId = id;
  }

  editar(id: number): void {
    void id;
    // implementar na próxima feature
    this.mostrarMensagemAcao('Edição de aluno');
  }

  fecharDetalhes(): void {
    this.alunoDetalheSelecionadoId = null;

    setTimeout(() => {
      this.ultimoElementoDetalhes?.focus();
      this.ultimoElementoDetalhes = null;
    });
  }

  excluir(aluno: AlunoLista): void {
    void aluno;
    // implementar na próxima feature
    this.mostrarMensagemAcao('Exclusão de aluno');
  }

  private inicializarFluxos(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.isApplyingQueryParams = true;

      const busca = (params.get('busca') ?? '').trim();
      const status = params.get('status');
      const pagina = Number(params.get('pagina') ?? '1');
      const ordenarPor = params.get('ordenarPor');
      const direcao = params.get('direcao');

      this.buscaControl.setValue(busca, { emitEvent: false });
      this.statusControl.setValue(this.normalizarStatus(status), { emitEvent: false });
      this.paginaAtual = Number.isFinite(pagina) && pagina > 0 ? pagina - 1 : 0;
      this.ordenarPor = ordenarPor === 'matricula' ? 'matricula' : 'nome';
      this.direcao = direcao === 'desc' ? 'desc' : 'asc';

      this.isApplyingQueryParams = false;

      if (this.criarQueryKey() === this.lastLoadedQueryKey) {
        return;
      }

      this.carregarAlunos();
    });

    this.buscaControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        if (this.isApplyingQueryParams) {
          return;
        }

        const valorNormalizado = valor.trim();
        if (valor !== valorNormalizado) {
          this.buscaControl.setValue(valorNormalizado, { emitEvent: false });
        }

        this.paginaAtual = 0;
        this.atualizarQueryParamsECarregar();
      });

    this.statusControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.isApplyingQueryParams) {
        return;
      }

      this.paginaAtual = 0;
      this.atualizarQueryParamsECarregar();
    });
  }

  private atualizarQueryParamsECarregar(): void {
    this.carregarAlunos();

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.montarQueryParams(),
    });
  }

  private montarQueryParams(): Record<string, string | number | null> {
    return {
      pagina: this.paginaAtual + 1,
      busca: this.buscaNormalizada() || null,
      status: this.statusControl.value === 'TODOS' ? null : this.statusControl.value,
      ordenarPor: this.ordenarPor === 'nome' ? null : this.ordenarPor,
      direcao: this.direcao === 'asc' ? null : this.direcao,
    };
  }

  private criarQueryKey(): string {
    return JSON.stringify(this.montarQueryParams());
  }

  private carregarAlunos(): void {
    this.requestSubscription?.unsubscribe();
    this.erroCarregamento = false;
    this.agendarIndicadorCarregamento();
    this.lastLoadedQueryKey = this.criarQueryKey();

    const busca = this.buscaNormalizada();
    const somenteNumeros = /^\d+$/.test(busca);

    this.requestSubscription = this.alunoService
      .listar({
        nome: busca && !somenteNumeros ? busca : undefined,
        matricula: busca && somenteNumeros ? busca : undefined,
        status: this.statusControl.value === 'TODOS' ? undefined : this.statusControl.value,
        pagina: this.paginaAtual,
        tamanho: this.tamanhoPagina,
        ordenarPor: this.ordenarPor,
        direcao: this.direcao,
      })
      .subscribe({
        next: (response) => {
          this.alunos = response.conteudo;
          this.totalElementos = response.totalElementos;
          this.totalPaginas = response.totalPaginas;
          this.paginaAtual = this.ajustarPaginaAtual(response.pagina, response.totalPaginas);
          this.finalizarCarregamento();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status !== 401) {
            this.erroCarregamento = true;
            this.alunos = [];
            this.totalElementos = 0;
            this.totalPaginas = 0;
          }

          this.finalizarCarregamento();
        },
      });
  }

  private agendarIndicadorCarregamento(): void {
    this.carregando = false;
    this.limparTemporizadorCarregamento();
    this.loadingDelayId = setTimeout(() => {
      this.carregando = true;
      this.loadingDelayId = null;
    }, 300);
  }

  private finalizarCarregamento(): void {
    this.limparTemporizadorCarregamento();
    this.carregando = false;
  }

  private limparTemporizadorCarregamento(): void {
    if (this.loadingDelayId) {
      clearTimeout(this.loadingDelayId);
      this.loadingDelayId = null;
    }
  }

  private normalizarStatus(status: string | null): StatusFiltro {
    if (status === 'ATIVO' || status === 'INATIVO') {
      return status;
    }

    return 'TODOS';
  }

  private buscaNormalizada(): string {
    return this.buscaControl.value.trim();
  }

  private ajustarPaginaAtual(pagina: number, totalPaginas: number): number {
    if (totalPaginas === 0) {
      return 0;
    }

    return Math.min(pagina, totalPaginas - 1);
  }

  private mostrarMensagemAcao(nomeAcao: string): void {
    this.mensagemAcao = `${nomeAcao} será implementada na próxima feature.`;
  }
}
