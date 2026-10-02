import { StatusAluno } from './status-aluno';

export interface AlunoDetalhe {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  foto: string | null;
  status: StatusAluno;
}