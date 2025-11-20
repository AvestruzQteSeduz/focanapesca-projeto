import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent {

  produtoForm: FormGroup;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      estoque: ['', [Validators.required, Validators.min(0)]],
      imagemUrl: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.produtoForm.invalid) return;

    this.productService.cadastrarProduto(this.produtoForm.value).subscribe(
      (res) => {
        this.mensagemSucesso = 'Produto cadastrado com sucesso!';
        // Reseta o formulário para cadastrar outro
        this.produtoForm.reset();

        // Opcional: Redirecionar para a home após 2 segundos
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      (error) => {
        console.error(error);
        this.mensagemErro = 'Erro ao cadastrar. Verifique se você é Admin.';
      }
    );
  }
}
