//Importações necessárias do modulo
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routing';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar'
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  // Declaração dos componentes pertencentes a este módulo
  declarations: [
    DashboardHomeComponent  // Componente principal da página do dashboard
  ],
  // Importações necessárias para o funcionamento do módulo
  imports: [
    CommonModule,  // Módulo que fornece diretivas e serviços comuns do Angular
    FormsModule,  // Módulo para trabalhar com formulários template-driven no Angular
    ReactiveFormsModule,  // Módulo para trabalhar com formulários reativos no Angular
    RouterModule.forChild(DASHBOARD_ROUTES),  // Módulo de roteamento para gerenciar rotas dentro deste módulo

    // PrimeNG - Biblioteca de componentes de UI
    SidebarModule,  // Módulo para utilizar o componente de sidebar (barra lateral)
    ButtonModule,  // Módulo para utilizar botões estilizados do PrimeNG
    ToolbarModule,  // Módulo para utilizar o componente de toolbar (barra de ferramentas)
    CardModule,  // Módulo para utilizar o componente de cards (cartões)
    ToastModule,  // Módulo para exibir notificações (toasts)
    ChartModule,  // Módulo para utilizar gráficos (charts)

    // Shared - Módulo compartilhado com componentes e serviços reutilizáveis
    SharedModule  // Módulo que contém componentes e diretivas compartilhadas por toda a aplicação
  ],
  // Provedores de serviços que estarão disponíveis para injeção de dependências neste módulo
  providers: [
    CookieService,  // Serviço para manipulação de cookies
    MessageService  // Serviço para exibir mensagens globais na aplicação (toasts)
  ],
})
// Definição do módulo DashboardModule, responsável por encapsular as funcionalidades do dashboard
export class DashboardModule { }
