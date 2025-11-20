import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  itens: CartItem[] = [];
  total: number = 0;
  frete: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private addressService: AddressService,
    private router: Router,
    private orderService: OrderService // <--- ESTE É O QUE FALTAVA!
  ) {
    this.checkoutForm = this.fb.group({
      // Endereço
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],

      // Pagamento
      metodoPagamento: ['CARTAO', Validators.required],
      titularCartao: ['', Validators.required],
      numeroCartao: ['', Validators.required],
      validadeCartao: ['', Validators.required],
      cvvCartao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Carrega itens do carrinho
    this.itens = this.cartService['cartItems'].value; // Acessando valor atual
    this.total = this.cartService.getTotal();

    if (this.itens.length === 0) {
      this.router.navigate(['/']); // Se não tem itens, volta pra home
    }
  }

  buscarCep() {
    const cep = this.checkoutForm.get('cep')?.value;
    if (cep && cep.length >= 8) {
      this.addressService.getAddressByCep(cep).subscribe(dados => {
        if (!dados.erro) {
          this.checkoutForm.patchValue({
            rua: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf
          });
          this.calcularFrete(dados.uf);
        }
      });
    }
  }

  // Simulação de cálculo de frete baseada no Estado
  calcularFrete(uf: string) {
    // Exemplo: SP é mais barato, outros estados mais caro
    if (uf === 'SP') {
      this.frete = 15.00;
    } else if (['RJ', 'MG', 'ES'].includes(uf)) {
      this.frete = 25.00;
    } else {
      this.frete = 45.00;
    }
  }

finalizarPedido() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const dadosPedido = {
      itens: this.itens,
      total: this.total + this.frete,
      frete: this.frete,
      endereco: this.checkoutForm.value,
      metodoPagamento: this.checkoutForm.get('metodoPagamento')?.value
    };

    // Usando 'any' para evitar erros de tipagem estrita do TypeScript
    this.orderService.criarPedido(dadosPedido).subscribe({
      next: (res: any) => {
        console.log('Pedido criado:', res);
        this.cartService.clearCart();
        alert('SUCESSO! Seu pedido foi realizado.');
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao processar o pedido. Tente novamente.');
      }
    });
  }
}
