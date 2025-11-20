import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  // Busca o endereço pelo CEP usando a API pública do ViaCEP
  getAddressByCep(cep: string): Observable<any> {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
  }
}
