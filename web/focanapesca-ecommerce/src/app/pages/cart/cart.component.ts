import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  itens: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Ouve as mudanças no carrinho
    this.cartService.cartItems$.subscribe(dados => {
      this.itens = dados;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.total = this.cartService.getTotal();
  }

  removerItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  limparCarrinho() {
    this.cartService.clearCart();
  }

  // Bônus: Função para simular finalizar compra (por enquanto)
  finalizarCompra() {
    alert('Indo para o pagamento...');
    // Aqui futuramente redirecionaremos para a página de Checkout/Frete
  }
  aumentarQuantidade(item: CartItem) {
    this.cartService.addToCart(item); // O serviço já soma +1 se o item existe
  }

  diminuirQuantidade(item: CartItem) {
    if (item.quantidadePedido > 1) {
      // Precisamos criar um método no serviço para diminuir,
      // mas por enquanto podemos fazer um "truque" manual ou atualizar o serviço.
      // Vamos fazer do jeito certo: Atualizando o Serviço (veja passo 4 abaixo).
      this.cartService.decreaseQuantity(item.id!);
    } else {
      // Se for 1 e diminuir, pergunta se quer remover
      this.removerItem(item.id!);
    }
  }

}
