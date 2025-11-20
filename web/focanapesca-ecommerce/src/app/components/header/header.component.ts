// src/app/components/header/header.component.ts
import { Component, OnInit } from '@angular/core'; // Adicione OnInit
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importe o AuthService
import { CommonModule } from '@angular/common'; // Importe CommonModule (para *ngIf)

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule // <-- Necessário para mudar o visual
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  usuario: any = null; // Aqui guardaremos os dados do usuário

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ao carregar o cabeçalho, verifica quem está logado
    this.usuario = this.authService.getUsuarioLogado();
  }

  fazerLogout(): void {
    this.authService.logout();
    this.usuario = null;
    this.router.navigate(['/login']); // Manda de volta para o login
  }
}
