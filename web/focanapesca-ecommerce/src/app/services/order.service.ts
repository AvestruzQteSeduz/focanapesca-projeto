import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // URL base para os pedidos
  private apiUrl = 'https://focanapesca-api.onrender.com/pedidos';

  constructor(private http: HttpClient) { }

  // --- Helper para pegar o Token ---
  // Cria o cabeçalho de autorização necessário para o backend saber quem é você
  private getHeaders(): HttpHeaders {
    // Verificação de segurança para SSR (Server Side Rendering)
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  // --- 1. FINALIZAR COMPRA (POST) ---
  // Envia os dados do carrinho para criar um novo pedido
  criarPedido(pedidoData: any): Observable<any> {
    return this.http.post(this.apiUrl, pedidoData, { headers: this.getHeaders() });
  }

  // --- 2. MEUS PEDIDOS (GET) ---
  // Busca o histórico de compras do usuário logado
  getMeusPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meus-pedidos`, { headers: this.getHeaders() });
  }
}
