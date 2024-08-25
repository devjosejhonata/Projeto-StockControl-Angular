// Importações de módulos necessários para a criação e funcionamento do módulo Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesHomeComponent } from './pages/categories-home/categories-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CATEGORIES_ROUTES } from './categories.routing';  // Rotas específicas para o módulo de categorias
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

// Importações de módulos do PrimeNG para componentes de interface do usuário
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';

// Importação de componentes específicos para o módulo de categorias
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

@NgModule({
  declarations: [
    // Declaração dos componentes que fazem parte do módulo de categorias
    CategoriesHomeComponent,
    CategoriesTableComponent,
    CategoryFormComponent
  ],
  imports: [
    // Módulos necessários para o funcionamento do módulo de categorias
    CommonModule,  // Fornece diretivas e pipes comuns como ngIf e ngFor
    FormsModule,   // Suporte para formulários template-driven
    ReactiveFormsModule,  // Suporte para formulários reativos
    RouterModule.forChild(CATEGORIES_ROUTES),  // Configuração de rotas específicas para o módulo de categorias
    SharedModule,  // Módulo compartilhado com componentes, diretivas e pipes reutilizáveis
    HttpClientModule,  // Suporte para fazer requisições HTTP

    // Módulos PrimeNG para construir a interface do usuário com componentes visuais
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
    // Serviços necessários para o funcionamento dos diálogos e confirmações
    DialogService,
    ConfirmationService
  ]
})
export class CategoriesModule { }
