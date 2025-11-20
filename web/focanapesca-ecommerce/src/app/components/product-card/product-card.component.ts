import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../services/product.service';
import { CartService } from '../../services/cart.service'; // <--- TEM QUE TER ISSO

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Produto;

  // <--- TEM QUE TER O CONSTRUTOR COM O CART SERVICE
  constructor(private cartService: CartService) {}

  // <--- TEM QUE TER ESSA FUNÇÃO
  adicionarAoCarrinho() {
    this.cartService.addToCart(this.product);
    console.log("Produto adicionado:", this.product.nome); // Adicionei um log para ajudar a ver
    alert('Produto adicionado ao carrinho!');
  }
}
