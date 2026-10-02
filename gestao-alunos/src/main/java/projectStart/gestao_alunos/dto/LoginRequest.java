package projectStart.gestao_alunos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        @NotBlank
        @Pattern(regexp = "^[a-zA-Z0-9]{8,}$")
        String login,

        @NotBlank
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z0-9]{8,20}$")
        String senha) {
}
