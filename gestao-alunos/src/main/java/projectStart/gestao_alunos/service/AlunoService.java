package projectStart.gestao_alunos.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projectStart.gestao_alunos.domain.Aluno;
import projectStart.gestao_alunos.domain.StatusAluno;
import projectStart.gestao_alunos.dto.AlunoCadastroRequest;
import projectStart.gestao_alunos.dto.AlunoDetalheResponse;
import projectStart.gestao_alunos.dto.AlunoListaResponse;
import projectStart.gestao_alunos.dto.PageResponse;
import projectStart.gestao_alunos.exception.ConflitoException;
import projectStart.gestao_alunos.exception.NaoEncontradoException;
import projectStart.gestao_alunos.repository.AlunoRepository;

import java.time.Year;
import java.util.Set;

@Service
public class AlunoService {

        private static final int TAMANHO_PADRAO = 10;
        private static final int TAMANHO_MAXIMO = 50;
        private static final Set<String> CAMPOS_ORDENACAO = Set.of("nome", "matricula");

        private final AlunoRepository alunoRepository;

        public AlunoService(AlunoRepository alunoRepository) {
            this.alunoRepository = alunoRepository;
        }

        public PageResponse<AlunoListaResponse> listar(String nome,
                                                       String matricula,
                                                       StatusAluno status,
                                                       int pagina,
                                                       int tamanho,
                                                       String ordenarPor,
                                                       String direcao) {

            String campo = CAMPOS_ORDENACAO.contains(ordenarPor) ? ordenarPor : "nome";
            Sort.Direction sentido = "desc".equalsIgnoreCase(direcao)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            int tamanhoValido = (tamanho < 1 || tamanho > TAMANHO_MAXIMO) ? TAMANHO_PADRAO : tamanho;

            Pageable pageable = PageRequest.of(Math.max(pagina, 0), tamanhoValido, Sort.by(sentido, campo));

            Page<AlunoListaResponse> resultado = alunoRepository
                    .buscar(limpar(nome), limpar(matricula), status, pageable)
                    .map(AlunoListaResponse::de);

            return PageResponse.of(resultado);
        }

    // ===================== CADASTRO =====================

    @Transactional
    public AlunoDetalheResponse cadastrar(AlunoCadastroRequest request) {
        // Formato já foi validado pelas anotações do Request (@CPF, @Pattern...).
        // Aqui só normalizamos para salvar sempre no mesmo padrão.
        String cpf = request.cpf().replaceAll("\\D", "");
        String telefone = request.telefone().replaceAll("\\D", "");
        String email = request.email().trim().toLowerCase();
        String nome = request.nome().trim().replaceAll("\\s+", " ");

        if (alunoRepository.existsByCpf(cpf)) {
            throw new ConflitoException("cpf", "Já existe um aluno com este CPF");
        }
        if (alunoRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflitoException("email", "Já existe um aluno com este e-mail");
        }

        Aluno aluno = Aluno.builder()
                .matricula(gerarMatricula())
                .nome(nome)
                .email(email)
                .cpf(cpf)
                .telefone(telefone)
                .status(StatusAluno.ATIVO)
                .build();

        return AlunoDetalheResponse.de(alunoRepository.save(aluno));
    }

    // ===================== AUXILIARES =====================

    // Ano atual + sequência de 4 dígitos: 20260025 -> 20260026
    private String gerarMatricula() {
        String prefixo = String.valueOf(Year.now().getValue());

        int proximo = alunoRepository.findTopByMatriculaStartingWithOrderByMatriculaDesc(prefixo)
                .map(a -> Integer.parseInt(a.getMatricula().substring(prefixo.length())) + 1)
                .orElse(1);

        return prefixo + String.format("%04d", proximo);
    }

        // RN-012: remove espaços das pontas; texto vazio vira null (= sem filtro)
        private String limpar(String texto) {
            if (texto == null || texto.isBlank()) {
                return null;
            }
            return texto.trim();
        }

        public AlunoDetalheResponse buscarPorId(Long id) {
            return alunoRepository.findById(id)
                    .map(AlunoDetalheResponse::de)
                    .orElseThrow(() -> new NaoEncontradoException("Aluno não encontrado"));
        }
}
