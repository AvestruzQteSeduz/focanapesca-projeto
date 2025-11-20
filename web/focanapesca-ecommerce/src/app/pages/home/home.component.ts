import { Component, OnInit } from '@angular/core';
import { ProductService, Produto } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Title, Meta } from '@angular/platform-browser'; // <-- 1. IMPORTAR

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  produtos: Produto[] = [];

  constructor(
    private productService: ProductService,
    private titleService: Title, // <-- 2. INJETAR TITLE
    private metaService: Meta    // <-- 3. INJETAR META
  ) {}

  ngOnInit(): void {
    // 4. CONFIGURAR SEO
    this.titleService.setTitle('Foca na Pesca - A Melhor Loja de Pesca Esportiva');
    this.metaService.updateTag({ name: 'description', content: 'Encontre varas, carretilhas e iscas para sua pescaria. Os melhores preços e entrega rápida para todo o Brasil.' });
    this.metaService.updateTag({ name: 'keywords', content: 'pesca, vara, carretilha, molinete, isca artificial, camping' });

    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.productService.getProdutos().subscribe(
      (dados) => {
        this.produtos = dados;
      },
      (erro) => {
        console.error('Erro ao carregar produtos:', erro);
      }
    );
  }
}
