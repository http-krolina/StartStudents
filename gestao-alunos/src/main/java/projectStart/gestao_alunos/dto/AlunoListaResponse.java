package projectStart.gestao_alunos.dto;

import projectStart.gestao_alunos.domain.Aluno;
import projectStart.gestao_alunos.domain.StatusAluno;

public record AlunoListaResponse(
        Long id,
        String matricula,
        String nome,
        StatusAluno status

) {
    public static AlunoListaResponse de(Aluno aluno) {
        return new AlunoListaResponse(
                aluno.getId(),
                aluno.getMatricula(),
                aluno.getNome(),
                aluno.getStatus()
        );
    }
}
