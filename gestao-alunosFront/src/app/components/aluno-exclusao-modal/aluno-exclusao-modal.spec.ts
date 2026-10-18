import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoExclusaoModalComponent } from './aluno-exclusao-modal';

describe('AlunoExclusaoModalComponent', () => {
  let fixture: ComponentFixture<AlunoExclusaoModalComponent>;
  let component: AlunoExclusaoModalComponent;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlunoExclusaoModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AlunoExclusaoModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('alunoId', 7);
    fixture.componentRef.setInput('nome', 'Maria Silva');
    fixture.componentRef.setInput('matricula', '2026001');
    fixture.detectChanges();
  });

  it('mostra nome e matrícula', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Maria Silva');
    expect(texto).toContain('2026001');
  });

  it('cancelar fecha sem chamar a API', () => {
    let fechou = false;
    component.fechar.subscribe(() => (fechou = true));
    component.cancelar();
    expect(fechou).toBe(true);
    http.expectNone('http://localhost:8080/api/alunos/7');
  });

  it('confirma com DELETE, bloqueia clique duplo e emite excluido', () => {
    let excluido = false;
    component.excluido.subscribe(() => (excluido = true));
    component.confirmar();
    component.confirmar();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Excluindo...');
    const req = http.expectOne('http://localhost:8080/api/alunos/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
    expect(excluido).toBe(true);
  });

  it('403 e status 0 mantêm o modal com mensagem', () => {
    component.confirmar();
    http.expectOne('http://localhost:8080/api/alunos/7').flush(null, { status: 403, statusText: 'Forbidden' });
    expect(component.mensagemErro).toBe('Você não tem permissão para esta ação.');
    component.confirmar();
    http.expectOne('http://localhost:8080/api/alunos/7').error(new ProgressEvent('error'), { status: 0 });
    expect(component.mensagemErro).toBe('Não foi possível conectar ao servidor. Tente novamente.');
  });

  it('404 emite naoEncontrado', () => {
    let emitiu = false;
    component.naoEncontrado.subscribe(() => (emitiu = true));
    component.confirmar();
    http.expectOne('http://localhost:8080/api/alunos/7').flush(null, { status: 404, statusText: 'Not Found' });
    expect(emitiu).toBe(true);
  });
});
