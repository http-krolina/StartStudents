package projectStart.gestao_alunos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import projectStart.gestao_alunos.dto.ErroResponse;
import projectStart.gestao_alunos.dto.ErroValidarResponse;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 422: campos inválidos no formulário, cada erro com o nome do campo
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroValidarResponse> validacao(MethodArgumentNotValidException ex) {
        List<ErroValidarResponse.CampoErro> erros = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new ErroValidarResponse.CampoErro(e.getField(), e.getDefaultMessage()))
                .toList();
        return ResponseEntity.unprocessableEntity()
                .body(new ErroValidarResponse("Existem campos inválidos", erros));
    }

    // 409: CPF ou e-mail já cadastrado (CA-06)
    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroValidarResponse> conflito(ConflitoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroValidarResponse(ex.getMessage(),
                        List.of(new ErroValidarResponse.CampoErro(ex.getCampo(), ex.getMessage()))));
    }

    // 404: Recurso não encontrado
    @ExceptionHandler(NaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(NaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErroResponse(ex.getMessage()));
    }
}
