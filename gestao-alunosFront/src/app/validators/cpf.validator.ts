import { AbstractControl, ValidationErrors } from '@angular/forms';

function extrairDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

function todosDigitosIguais(cpf: string): boolean {
  return /^([0-9])\1{10}$/.test(cpf);
}

function calcularDigito(cpf: string, fatorInicial: number): number {
  let soma = 0;

  for (let indice = 0; indice < cpf.length; indice += 1) {
    soma += Number(cpf.charAt(indice)) * (fatorInicial - indice);
  }

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cpfValidator(control: AbstractControl<string | null>): ValidationErrors | null {
  const valor = control.value ?? '';
  const cpf = extrairDigitos(valor);

  if (!cpf) {
    return null;
  }

  if (cpf.length !== 11 || todosDigitosIguais(cpf)) {
    return { cpfInvalido: true };
  }

  const digito1 = calcularDigito(cpf.slice(0, 9), 10);
  const digito2 = calcularDigito(cpf.slice(0, 10), 11);

  if (digito1 !== Number(cpf.charAt(9)) || digito2 !== Number(cpf.charAt(10))) {
    return { cpfInvalido: true };
  }

  return null;
}