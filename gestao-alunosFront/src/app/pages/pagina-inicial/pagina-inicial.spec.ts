import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { PaginaInicialComponent } from './pagina-inicial';
import { AlunoService } from '../../services/aluno.service';
import { AuthService } from '../../services/auth';

describe('PaginaInicialComponent', () => {
  let component: PaginaInicialComponent;
  let fixture: ComponentFixture<PaginaInicialComponent>;
  let listarSpy: Mock;
  let navigateSpy: Mock;
  let queryParamMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    listarSpy = vi.fn((filtros: { pagina?: number }) =>
      of({
        conteudo: [],
        pagina: filtros.pagina ?? 0,
        tamanho: 10,
        totalElementos: 0,
        totalPaginas: 3,
      })
    );
    navigateSpy = vi.fn().mockResolvedValue(true);
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));

    await TestBed.configureTestingModule({
      imports: [PaginaInicialComponent],
      providers: [
        {
          provide: AlunoService,
          useValue: {
            listar: listarSpy,
          },
        },
        {
          provide: AuthService,
          useValue: {
            obterPerfil: () => 'ADMINISTRADOR',
            obterLogin: () => 'admin001',
            logout: () => undefined,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: navigateSpy,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMapSubject.asObservable(),
            snapshot: {
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega a nova pagina no primeiro clique sem depender de novo evento da rota', () => {
    listarSpy.mockClear();
    navigateSpy.mockClear();
    component.totalPaginas = 3;

    component.irParaPagina(2);

    expect(listarSpy).toHaveBeenCalledTimes(1);
    expect(listarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pagina: 1,
      })
    );
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({
          pagina: 2,
        }),
      })
    );
  });

  it('carrega o filtro de status no primeiro clique sem depender de novo evento da rota', () => {
    listarSpy.mockClear();
    navigateSpy.mockClear();

    component.statusControl.setValue('ATIVO');

    expect(listarSpy).toHaveBeenCalledTimes(1);
    expect(listarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pagina: 0,
        status: 'ATIVO',
      })
    );
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({
          pagina: 1,
          status: 'ATIVO',
        }),
      })
    );
  });

  it('nao recarrega duas vezes quando a rota emite o mesmo estado apos a navegacao local', () => {
    listarSpy.mockClear();
    component.totalPaginas = 3;

    component.irParaPagina(2);
    queryParamMapSubject.next(convertToParamMap({ pagina: '2' }));

    expect(listarSpy.mock.calls).toHaveLength(1);
  });

  it('abre os detalhes sem sair da lista e devolve foco ao fechar', async () => {
    const botaoDetalhes = document.createElement('button');
    document.body.appendChild(botaoDetalhes);
    botaoDetalhes.focus();

    const focusSpy = vi.spyOn(botaoDetalhes, 'focus');

    component.verDetalhes(7);

    expect(component.alunoDetalheSelecionadoId).toBe(7);

    component.fecharDetalhes();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(component.alunoDetalheSelecionadoId).toBeNull();

    document.body.removeChild(botaoDetalhes);
  });
});
