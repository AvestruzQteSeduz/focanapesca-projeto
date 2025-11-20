// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <-- 1. Importe a biblioteca nova

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://focanapesca-api.onrender.com/usuarios';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // --- NOVOS MÉTODOS ---

  // Verifica se tem um token salvo
  isLoggedIn(): boolean {
    // No Angular moderno, precisamos verificar se 'localStorage' existe
    // (para evitar erros se o site rodar no servidor)
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Decodifica o token para pegar os dados (Id, Nome, Role)
  getUsuarioLogado(): any {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          return jwtDecode(token); // Aqui a mágica acontece
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }

  // Remove o token para deslogar
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}
