// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- 1. IMPORTE O ROUTEROUTLET
import { HeaderComponent } from './components/header/header.component'; // <-- 2. IMPORTE O HEADER
import { FooterComponent } from './components/footer/footer.component'; // <-- 3. IMPORTE O FOOTER

@Component({
  selector: 'app-root',
  standalone: true, // <-- Seu componente é Standalone

  // 4. ADICIONE ESSA LINHA 'IMPORTS'
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'focanapesca-ecommerce';
}
