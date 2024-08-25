import { Component, OnInit } from '@angular/core';
// Importa os módulos Component e OnInit do Angular core
import { PrimeNGConfig } from 'primeng/api';
// Importa PrimeNGConfig para configurar o PrimeNG

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
})
export class AppComponent implements OnInit { // Define a classe do componente e implementa a interface OnInit
  title = 'stock-control'; // Propriedade para armazenar o título da aplicação

  constructor(private primeNgConfig: PrimeNGConfig) {} // Injeta PrimeNGConfig no construtor para configuração do PrimeNG

  ngOnInit(): void { // Método do ciclo de vida do Angular chamado após a inicialização do componente
    this.primeNgConfig.ripple = true; // Ativa o efeito ripple (efeito de onda) globalmente no PrimeNG
    this.primeNgConfig.setTranslation({ // Define as traduções para os textos do PrimeNG
      apply: 'Aplicar', // Tradução para o botão "Apply"
      clear: 'Limpar' // Tradução para o botão "Clear"
    })
  }
}
