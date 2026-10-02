package projectStart.gestao_alunos.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import projectStart.gestao_alunos.dto.ErroResponse;
import projectStart.gestao_alunos.dto.LoginRequest;
import projectStart.gestao_alunos.dto.LoginResponse;
import projectStart.gestao_alunos.security.JwtService;

@RequestMapping("/api/auth")
@RestController
public class UsuarioController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

   public UsuarioController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
   }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        Authentication autenticacao;

        try {
            autenticacao = authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    request.login(), request.senha()
                )
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErroResponse("Credenciais inválidas"));
        }

        String login = autenticacao.getName();
        String perfil = autenticacao.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String token = jwtService.gerarToken(login, perfil);

        return ResponseEntity.ok(new LoginResponse(token, perfil));
    }
}
