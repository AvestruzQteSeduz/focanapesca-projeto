// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './product.service'; // Certifique-se que o caminho está certo


// Estendemos a interface Produto para adicionar 'quantidadePedido'
export interface CartItem extends Produto {
  quantidadePedido: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // O BehaviorSubject guarda o estado atual do carrinho
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observable que os componentes vão "ouvir"
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  // Adicionar
  addToCart(produto: Produto) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === produto.id);

    if (existingItem) {
      existingItem.quantidadePedido++;
    } else {
      currentItems.push({ ...produto, quantidadePedido: 1 });
    }

    this.updateCart(currentItems);
  }

  // Remover
  removeFromCart(produtoId: number) {
    const currentItems = this.cartItems.value.filter(item => item.id !== produtoId);
    this.updateCart(currentItems);
  }
  decreaseQuantity(produtoId: number) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === produtoId);

    if (existingItem) {
      if (existingItem.quantidadePedido > 1) {
        existingItem.quantidadePedido--;
        this.updateCart(currentItems);
      } else {
        // Se chegar a 0, remove
        this.removeFromCart(produtoId);
      }
    }
  }

  // Limpar
  clearCart() {
    this.updateCart([]);
  }

  // Calcular Total
  getTotal(): number {
    return this.cartItems.value.reduce((acc, item) => acc + (item.preco * item.quantidadePedido), 0);
  }

  // Salvar no LocalStorage e atualizar quem está ouvindo
  private updateCart(items: CartItem[]) {
    this.cartItems.next(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  // Carregar do LocalStorage ao iniciar
  private loadCart() {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    }
  }
}
