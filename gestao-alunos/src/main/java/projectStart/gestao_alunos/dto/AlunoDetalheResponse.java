package projectStart.gestao_alunos.dto;

import projectStart.gestao_alunos.domain.Aluno;
import projectStart.gestao_alunos.domain.StatusAluno;

public record AlunoDetalheResponse(
        Long id,
        String matricula,
        String nome,
        String email,
        String cpf,
        String telefone,
        String foto,
        StatusAluno status
) {
    public static AlunoDetalheResponse de(Aluno aluno) {
        return new AlunoDetalheResponse(
                aluno.getId(), aluno.getMatricula(), aluno.getNome(), aluno.getEmail(),
                aluno.getCpf(), aluno.getTelefone(), aluno.getFoto(), aluno.getStatus());
    }
}
