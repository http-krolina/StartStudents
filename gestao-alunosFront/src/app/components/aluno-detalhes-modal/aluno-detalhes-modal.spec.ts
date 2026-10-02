import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AlunoDetalhesModalComponent } from './aluno-detalhes-modal';
import { AlunoService } from '../../services/aluno.service';

describe('AlunoDetalhesModalComponent', () => {
  let component: AlunoDetalhesModalComponent;
  let fixture: ComponentFixture<AlunoDetalhesModalComponent>;
  let buscarPorIdSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    buscarPorIdSpy = vi.fn().mockReturnValue(
      of({
        id: 1,
        matricula: '2024001',
        nome: 'Ana Ferreira',
        email: 'ana@exemplo.com',
        cpf: '12345678901',
        telefone: '11987654321',
        foto: null,
        status: 'ATIVO',
      })
    );

    await TestBed.configureTestingModule({
      imports: [AlunoDetalhesModalComponent],
      providers: [
        {
          provide: AlunoService,
          useValue: {
            buscarPorId: buscarPorIdSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunoDetalhesModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('alunoId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega o aluno quando recebe o id', () => {
    expect(buscarPorIdSpy).toHaveBeenCalledTimes(1);
    expect(buscarPorIdSpy).toHaveBeenCalledWith(1);
    expect(component.aluno?.nome).toBe('Ana Ferreira');
  });

  it('formata cpf e telefone', () => {
    expect(component.formatarCpf('12345678901')).toBe('123.456.789-01');
    expect(component.formatarTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('mostra mensagem de 404 quando o aluno nao existe', () => {
    buscarPorIdSpy.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    fixture.componentRef.setInput('alunoId', 2);
    component['carregarAluno']();

    expect(component.mensagemErro).toBe('Aluno não encontrado.');
    expect(component.mostrarBotaoTentarNovamente).toBe(false);
  });
});
