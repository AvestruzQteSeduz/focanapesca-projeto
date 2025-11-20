// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component'; // 1. Importe o Login
import { CadastroComponent } from './pages/cadastro/cadastro.component'; // 2. Importe o Cadastro
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
  path: 'admin/produtos',
    component: AdminProductsComponent
  },
  {
    path: 'carrinho',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'meus-pedidos',
    component: MyOrdersComponent
  },
];
