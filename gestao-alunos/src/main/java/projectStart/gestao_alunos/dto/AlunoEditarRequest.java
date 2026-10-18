package projectStart.gestao_alunos.dto;

import jakarta.validation.constraints.*;
import projectStart.gestao_alunos.domain.StatusAluno;

public record AlunoEditarRequest(
        @Pattern(regexp = ".*\\S.*", message = "O e-mail não pode ser vazio")
        @Email(message = "Informe um e-mail válido")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
        String email,


        @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres")
        @Pattern(regexp = "^[\\p{L} '\\-]+$", message = "O nome aceita apenas letras, espaços, hífen e apóstrofo")
        String nome,


        @Pattern(regexp = "^\\d{10,11}$", message = "O telefone deve conter apenas números e ter 10 ou 11 dígitos")
        String telefone,

        @NotNull(message = "O status é obrigatório")
        StatusAluno status) {


}

// email, nome, telefone, status
