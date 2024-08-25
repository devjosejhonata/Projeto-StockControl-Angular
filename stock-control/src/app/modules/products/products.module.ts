import { NgModule } from '@angular/core';
// Importa o decorator NgModule para definir um módulo Angular
import { CommonModule } from '@angular/common';
// Importa o módulo CommonModule que fornece diretivas e pipes comuns como ngIf e ngFor
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importa módulos para formularios baseados em template e reativos
import { SharedModule } from 'src/app/shared/shared.module';
// Importa um módulo compartilhado definido em um caminho específico
import { HttpClientModule } from '@angular/common/http';
// Importa o módulo HttpClientModule para realizar requisições HTTP
import { CardModule } from 'primeng/card';
// Importa o módulo CardModule da biblioteca PrimeNG para criar cartões
import { ButtonModule } from 'primeng/button';
// Importa o módulo ButtonModule da biblioteca PrimeNG para criar botões
import { TableModule } from 'primeng/table';
// Importa o módulo TableModule da biblioteca PrimeNG para criar tabelas
import { InputMaskModule } from 'primeng/inputmask';
// Importa o módulo InputMaskModule da biblioteca PrimeNG para mascarar entradas de texto
import { InputSwitchModule } from 'primeng/inputswitch';
// Importa o módulo InputSwitchModule da biblioteca PrimeNG para criar interruptores
import { InputTextModule } from 'primeng/inputtext';
// Importa o módulo InputTextModule da biblioteca PrimeNG para criar campos de texto
import { InputTextareaModule } from 'primeng/inputtextarea';
// Importa o módulo InputTextareaModule da biblioteca PrimeNG para criar áreas de texto
import { InputNumberModule } from 'primeng/inputnumber';
// Importa o módulo InputNumberModule da biblioteca PrimeNG para criar campos de número
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
// Importa o serviço e o módulo para diálogos dinâmicos da biblioteca PrimeNG
import { DropdownModule } from 'primeng/dropdown';
// Importa o módulo DropdownModule da biblioteca PrimeNG para criar menus suspensos
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// Importa o módulo ConfirmDialogModule da biblioteca PrimeNG para criar diálogos de confirmação
import { TooltipModule } from 'primeng/tooltip';
// Importa o módulo TooltipModule da biblioteca PrimeNG para criar tooltips
import { ConfirmationService } from 'primeng/api';
// Importa o serviço de confirmação da biblioteca PrimeNG para gerenciar diálogos de confirmação
import { ProductsHomeComponent } from './page/products-home/products-home.component';
// Importa o componente de página inicial de produtos
import { RouterModule } from '@angular/router';
// Importa o módulo RouterModule para gerenciamento de rotas
import { PRODUCTS_ROUTES } from './products.routing';
// Importa as rotas específicas para o módulo de produtos
import { ProductsTableComponent } from './components/products-table/products-table.component';
// Importa o componente da tabela de produtos
import { ProductFormComponent } from './components/product-form/product-form.component';
// Importa o componente do formulário de produto

@NgModule({
  declarations: [
    ProductsHomeComponent, // Declara o componente da página inicial de produtos
    ProductsTableComponent, // Declara o componente da tabela de produtos
    ProductFormComponent // Declara o componente do formulário de produto
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PRODUCTS_ROUTES), // Configura o roteamento filho usando as rotas de produtos
    SharedModule,
    HttpClientModule,
    //PrimeNg
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule 
  ],
  providers: [
    DialogService, // Fornece o serviço DialogService da PrimeNG
    ConfirmationService // Fornece o serviço ConfirmationService da PrimeNG
  ]
})
export class ProductsModule { } // Define e exporta o módulo ProductsModule
