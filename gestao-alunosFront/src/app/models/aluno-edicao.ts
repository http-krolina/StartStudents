import { StatusAluno } from './status-aluno';

export interface AlunoEdicao {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: StatusAluno;
}
