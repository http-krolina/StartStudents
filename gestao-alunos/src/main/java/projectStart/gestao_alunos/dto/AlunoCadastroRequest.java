package projectStart.gestao_alunos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

public record AlunoCadastroRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres")
        @Pattern(regexp = "^[\\p{L} '\\-]+$",
                message = "O nome aceita apenas letras, espaços, hífen e apóstrofo")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Informe um e-mail válido")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
        String email,

        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "Informe um CPF válido")
        String cpf,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = "^\\d{10,11}$", message = "O telefone deve conter apenas números e ter 10 ou 11 dígitos")
        String telefone,

        @Pattern(regexp = "^$|^data:image/(png|jpeg);base64,[A-Za-z0-9+/=]+$", message = "A foto deve está no formato PNG ou JPEG")
        @Size(max = 6_990_531, message = "A foto deve ter no máximo 5MB")
        String foto
) {
}
