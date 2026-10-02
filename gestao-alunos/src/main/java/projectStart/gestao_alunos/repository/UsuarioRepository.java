package projectStart.gestao_alunos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projectStart.gestao_alunos.domain.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);
}
