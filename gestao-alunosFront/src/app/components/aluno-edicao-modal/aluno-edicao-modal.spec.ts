import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoEdicaoModalComponent } from './aluno-edicao-modal';

const ALUNO = {
  id: 1,
  matricula: '2026001',
  nome: 'Maria Silva',
  email: 'maria@x.com',
  cpf: '52998224725',
  telefone: '81981028382',
  foto: null,
  status: 'ATIVO',
};

describe('AlunoEdicaoModalComponent', () => {
  let fixture: ComponentFixture<AlunoEdicaoModalComponent>;
  let component: AlunoEdicaoModalComponent;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlunoEdicaoModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AlunoEdicaoModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('alunoId', 1);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/alunos/1').flush(ALUNO);
    fixture.detectChanges();
  });

  it('preenche o formulário com telefone mascarado e começa sem permitir salvar', () => {
    expect(component.form.controls.telefone.value).toBe('(81) 98102-8382');
    expect(component.podeSalvar()).toBe(false);
  });

  it('habilita ao mudar e desabilita ao restaurar o original normalizado', () => {
    component.form.controls.nome.setValue('Maria Souza');
    expect(component.podeSalvar()).toBe(true);
    component.form.controls.nome.setValue('  Maria Silva ');
    expect(component.podeSalvar()).toBe(false);
  });

  it('não permite salvar com campo inválido', () => {
    component.form.controls.email.setValue('invalido');
    expect(component.podeSalvar()).toBe(false);
  });

  it('envia apenas campos alterados e telefone só com dígitos', () => {
    component.form.controls.telefone.setValue('(81) 98102-0000');
    component.selecionarStatus('INATIVO');
    component.salvar();
    const req = http.expectOne('http://localhost:8080/api/alunos/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ telefone: '81981020000', status: 'INATIVO' });
  });

  it('mostra erro 409 no campo e-mail', () => {
    component.form.controls.email.setValue('outro@x.com');
    component.salvar();
    http
      .expectOne('http://localhost:8080/api/alunos/1')
      .flush(
        { mensagem: 'x', erros: [{ campo: 'email', mensagem: 'E-mail já cadastrado' }] },
        { status: 409, statusText: 'Conflict' }
      );
    expect(component.mensagemCampo('email')).toBe('E-mail já cadastrado');
    expect(component.salvando).toBe(false);
  });

  it('pede confirmação ao fechar com alterações e fecha direto sem alterações', () => {
    let fechou = 0;
    component.fechar.subscribe(() => fechou++);
    component.solicitarFechamento();
    expect(fechou).toBe(1);

    component.form.controls.nome.setValue('Maria Souza');
    component.solicitarFechamento();
    expect(component.confirmandoSaida).toBe(true);
    expect(fechou).toBe(1);
    component.sairSemSalvar();
    expect(fechou).toBe(2);
  });
});
