import { NgModule } from '@angular/core';
// Importa o decorador NgModule do Angular para definir um módulo
import { CommonModule, CurrencyPipe } from '@angular/common';
// Importa CommonModule para diretivas comuns e CurrencyPipe para formatação de moeda
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importa módulos de formulários para formulários baseados em template e reativos
import { RouterModule } from '@angular/router';
// Importa RouterModule para configuração de rotas
import { ToolbarModule } from 'primeng/toolbar';
// Importa ToolbarModule do PrimeNG para criar barras de ferramentas
import { CardModule } from 'primeng/card';
// Importa CardModule do PrimeNG para criar cartões
import { ButtonModule } from 'primeng/button';
// Importa ButtonModule do PrimeNG para criar botões
import { DialogService } from 'primeng/dynamicdialog';
// Importa DialogService do PrimeNG para gerenciamento de diálogos dinâmicos
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
// Importa o componente ToolbarNavigationComponent
import { ShortenPipe } from './pipes/shorten/shorten.pipe';
// Importa o pipe ShortenPipe

@NgModule({
  declarations: [
    ToolbarNavigationComponent, 
    ShortenPipe
  ],
  imports: [
    CommonModule, // Importa CommonModule para utilizar diretivas comuns como ngIf e ngFor
    FormsModule, // Importa FormsModule para formulários baseados em template
    ReactiveFormsModule, // Importa ReactiveFormsModule para formulários reativos
    RouterModule, // Importa RouterModule para configuração de rotas
    // Módulos PrimeNG
    ToolbarModule, // Importa ToolbarModule para barras de ferramentas PrimeNG
    CardModule, // Importa CardModule para cartões PrimeNG
    ButtonModule // Importa ButtonModule para botões PrimeNG
  ],
  exports: [ToolbarNavigationComponent, ShortenPipe], // Exporta o componente ToolbarNavigationComponent e o pipe ShortenPipe para serem usados em outros módulos
  providers: [DialogService, CurrencyPipe] // Fornecedores de serviços DialogService e CurrencyPipe para o módulo
})
export class SharedModule { } // Define o módulo SharedModule
