export interface ErroValidacaoItem {
  campo: string;
  mensagem: string;
}

export interface ErroValidacao {
  mensagem: string;
  erros: ErroValidacaoItem[];
}