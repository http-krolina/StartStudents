import { StatusAluno } from './status-aluno';

export interface AlunoLista {
  id: number;
  matricula: string;
  nome: string;
  status: StatusAluno;
}