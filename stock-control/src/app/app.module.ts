import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Importa BrowserModule para suporte a aplicações Angular no navegador
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Importa BrowserAnimationsModule para animações no Angular
import { HttpClientModule } from '@angular/common/http';
// Importa HttpClientModule para realizar requisições HTTP
import { ReactiveFormsModule } from '@angular/forms';
// Importa ReactiveFormsModule para formulários reativos
import { CookieService } from 'ngx-cookie-service';
// Importa CookieService para manipulação de cookies

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
// Importa o módulo Toast do PrimeNG para mensagens toast

import { AppRoutingModule } from './app-routing.module';
// Importa o módulo de roteamento da aplicação
import { AppComponent } from './app.component';
// Importa o componente raiz da aplicação
import { HomeComponent } from './modules/home/home.component';
// Importa o componente Home

import { MessageService } from 'primeng/api'; // Importa MessageService do PrimeNG para gerenciamento de mensagens

@NgModule({
  declarations: [ // Declara os componentes que pertencem a este módulo
    
    AppComponent,
    HomeComponent,
  ],
  imports: [ // Importa outros módulos necessários para este módulo

    BrowserModule, // Necessário para executar a aplicação no navegador
    AppRoutingModule, // Módulo de roteamento da aplicação
    BrowserAnimationsModule, // Suporte a animações no Angular
    ReactiveFormsModule, // Suporte a formulários reativos
    HttpClientModule, // Suporte para requisições HTTP
    // PrimeNg
    CardModule, // Módulo do PrimeNG para cartões
    InputTextModule, // Módulo do PrimeNG para campos de texto
    ButtonModule, // Módulo do PrimeNG para botões
    ToastModule, // Módulo do PrimeNG para mensagens toast
  ],
  providers: [ // Fornecedores de serviços para o módulo

    CookieService, // Serviço para manipulação de cookies
    MessageService, // Serviço para gerenciamento de mensagens
  ],
  bootstrap: [AppComponent], // Componente raiz a ser inicializado ao iniciar a aplicação
})
export class AppModule {} // Define o módulo principal da aplicação
