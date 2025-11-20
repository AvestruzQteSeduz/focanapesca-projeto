// src/app/pages/cadastro/cadastro.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CpfValidator } from '../../validators/cpf.validator';
// Note que não importamos NgxMaskDirective aqui, pois ele já está global no app.config.ts
import { Title } from '@angular/platform-browser'; // <-- 1. Importe o Title para SEO

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  cadastroForm: FormGroup;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title // <-- 2. Injete o serviço de Título
  ) {
    // 3. Defina o Título da aba do navegador para esta página
    this.titleService.setTitle('Crie sua Conta - Foca na Pesca');

    this.cadastroForm = this.fb.group({
      // Dados Pessoais
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // Validação de senha forte
      senha: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      // Validação customizada de CPF
      cpf: ['', [Validators.required, CpfValidator()]],
      rg: [''], // Opcional

      // Endereço
      cep: ['', [Validators.required]],
      rua: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required, Validators.maxLength(2)]]
    });
  }

  onSubmit(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched(); // Mostra erros em vermelho
      this.mensagemErro = "Por favor, preencha todos os campos obrigatórios.";
      return;
    }

    this.authService.register(this.cadastroForm.value).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = 'Cadastro realizado com sucesso! Redirecionando para o Login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (erro) => {
        console.error('Erro no cadastro:', erro);
        if (erro.status === 409) {
          this.mensagemErro = 'Erro: Email ou CPF já está em uso.';
        } else {
          this.mensagemErro = 'Ocorreu um erro no cadastro. Tente novamente.';
        }
      }
    });
  }
}
