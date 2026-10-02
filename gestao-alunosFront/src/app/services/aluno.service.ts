import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AlunoCadastro } from '../models/aluno-cadastro';
import { AlunoDetalhe } from '../models/aluno-detalhe';
import { AlunoLista } from '../models/aluno-lista';
import { PaginaResponse } from '../models/pagina-response';
import { StatusAluno } from '../models/status-aluno';

type OrdenacaoAluno = 'nome' | 'matricula';
type DirecaoOrdenacao = 'asc' | 'desc';

export interface ListarAlunosFiltros {
  nome?: string;
  matricula?: string;
  status?: StatusAluno;
  pagina?: number;
  tamanho?: number;
  ordenarPor?: OrdenacaoAluno;
  direcao?: DirecaoOrdenacao;
}

interface PaginaResponseApi<T> {
  conteudo: T[];
  numeroPagina: number;
  tamanhoPagina: number;
  totalElementos: number;
  totalPaginas: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/alunos';

  cadastrar(dados: AlunoCadastro): Observable<AlunoDetalhe> {
    return this.http.post<AlunoDetalhe>(this.apiUrl, dados);
  }

  buscarPorId(id: number): Observable<AlunoDetalhe> {
    return this.http.get<AlunoDetalhe>(`${this.apiUrl}/${id}`);
  }

  listar(filtros: ListarAlunosFiltros): Observable<PaginaResponse<AlunoLista>> {
    let params = new HttpParams();

    if (filtros.nome) {
      params = params.set('nome', filtros.nome);
    }

    if (filtros.matricula) {
      params = params.set('matricula', filtros.matricula);
    }

    if (filtros.status) {
      params = params.set('status', filtros.status);
    }

    if (filtros.pagina !== undefined) {
      params = params.set('pagina', filtros.pagina);
    }

    if (filtros.tamanho !== undefined) {
      params = params.set('tamanho', filtros.tamanho);
    }

    if (filtros.ordenarPor) {
      params = params.set('ordenarPor', filtros.ordenarPor);
    }

    if (filtros.direcao) {
      params = params.set('direcao', filtros.direcao);
    }

    return this.http
      .get<PaginaResponseApi<AlunoLista>>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          conteudo: response.conteudo,
          pagina: response.numeroPagina,
          tamanho: response.tamanhoPagina,
          totalElementos: response.totalElementos,
          totalPaginas: response.totalPaginas,
        }))
      );
  }
}