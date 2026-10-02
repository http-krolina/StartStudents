package projectStart.gestao_alunos.service;


import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import projectStart.gestao_alunos.repository.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) {
        var usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() ->
                    new UsernameNotFoundException("Usuário não encontrado")
                );


        return User.builder()
                .username(usuario.getLogin())
                .password(usuario.getSenhaHash())
                .authorities("ROLE_" + usuario.getPerfil().name())
                .build();
    }
}
