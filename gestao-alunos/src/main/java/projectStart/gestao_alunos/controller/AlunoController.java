package projectStart.gestao_alunos.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import projectStart.gestao_alunos.domain.StatusAluno;
import projectStart.gestao_alunos.dto.AlunoCadastroRequest;
import projectStart.gestao_alunos.dto.AlunoDetalheResponse;
import projectStart.gestao_alunos.dto.AlunoListaResponse;
import projectStart.gestao_alunos.dto.PageResponse;
import projectStart.gestao_alunos.service.AlunoService;

import java.net.URI;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LEITOR')")
    public ResponseEntity<PageResponse<AlunoListaResponse>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String matricula,
            @RequestParam(required = false) StatusAluno status,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho,
            @RequestParam(defaultValue = "nome") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direcao) {

        return ResponseEntity.ok(
                alunoService.listar(nome, matricula, status, pagina, tamanho, ordenarPor, direcao));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AlunoDetalheResponse> cadastrar(@Valid @RequestBody AlunoCadastroRequest request) {
        AlunoDetalheResponse criado = alunoService.cadastrar(request);
        URI local = URI.create("/api/alunos/" + criado.id());
        return ResponseEntity.created(local).body(criado);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LEITOR')")
    public ResponseEntity<AlunoDetalheResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }
}
