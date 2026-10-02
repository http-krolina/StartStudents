package projectStart.gestao_alunos.exception;

public class ConflitoException extends RuntimeException {
    private final String campo;

    public ConflitoException(String campo, String mensagem) {
        super(mensagem);
        this.campo = campo;
    }

    public String getCampo() {
        return campo;
    }
}
