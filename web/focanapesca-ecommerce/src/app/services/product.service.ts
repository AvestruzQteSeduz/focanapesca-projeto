// src/app/services/product.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Importe HttpHeaders
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number; // id é opcional na criação
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagemUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://focanapesca-api.onrender.com/produtos';

  constructor(private http: HttpClient) { }

  // LISTAR (Público)
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  // CADASTRAR (Protegido - Precisa de Token)
  cadastrarProduto(produto: Produto): Observable<Produto> {
    // 1. Pega o token do navegador
    const token = localStorage.getItem('token');

    // 2. Cria o cabeçalho com o token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Envia o POST com os headers
    return this.http.post<Produto>(this.apiUrl, produto, { headers: headers });
  }
}
