// src/app/validators/cpf.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    // Pega o valor do campo e limpa (remove pontos e traços)
    const cpf = (control.value || '').replace(/[^\d]/g, '');

    // Se não tiver 11 dígitos, nem é um CPF
    if (cpf.length !== 11) {
      return { cpfInvalido: true };
    }

    // Verifica CPFs "inválidos" conhecidos (todos os números iguais)
    if (/^(\d)\1+$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    // --- Lógica de Validação (Dígitos Verificadores) ---
    let soma = 0;
    let resto;

    // 1. Cálculo do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
      return { cpfInvalido: true };
    }

    // 2. Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
      return { cpfInvalido: true };
    }

    // Se passou por tudo, o CPF é válido!
    return null;
  };
}
