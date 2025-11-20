// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // RouterLink para o botão "Criar Conta"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  mensagemErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.mensagemErro = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      (resposta) => {
        // 1. O Login deu certo! A API retornou o token.
        console.log('Login sucesso!', resposta);

        // 2. SALVAR O TOKEN NO NAVEGADOR (LocalStorage)
        // Isso mantém o usuário logado mesmo se fechar o site.
        localStorage.setItem('token', resposta.token);

        // 3. Redirecionar para a Home
        this.router.navigate(['/']);
      },
      (erro) => {
        console.error('Erro no login:', erro);
        this.mensagemErro = 'Email ou senha incorretos.';
      }
    );
  }
}
