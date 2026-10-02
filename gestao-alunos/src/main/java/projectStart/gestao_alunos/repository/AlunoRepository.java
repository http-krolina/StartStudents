package projectStart.gestao_alunos.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import projectStart.gestao_alunos.domain.Aluno;
import projectStart.gestao_alunos.domain.StatusAluno;

import java.util.Optional;


public interface AlunoRepository extends JpaRepository<Aluno, Long> {

        @Query("""
           SELECT a FROM Aluno a
           WHERE (:status IS NULL OR a.status = :status)
             AND (:nome IS NULL OR LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
             AND (:matricula IS NULL OR a.matricula LIKE CONCAT(:matricula, '%'))
           """)
        Page<Aluno> buscar(@Param("nome") String nome,
                                  @Param("matricula") String matricula,
                                  @Param("status") StatusAluno status,
                                  Pageable pageable);

        boolean existsByCpf(String cpf);
        boolean existsByEmailIgnoreCase(String email);

        Optional<Aluno> findTopByMatriculaStartingWithOrderByMatriculaDesc(String prefixo);
    }
