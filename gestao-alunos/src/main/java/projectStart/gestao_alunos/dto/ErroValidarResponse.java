package projectStart.gestao_alunos.dto;

import java.util.List;

public record ErroValidarResponse(String mensagem, List<CampoErro> erros) {

    public record CampoErro(String campo, String mensagem) {}
}
