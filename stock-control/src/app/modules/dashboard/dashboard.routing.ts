import { Routes } from '@angular/router';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',  // Rota padrão para o módulo do dashboard, associada ao caminho raiz ('')
    component: DashboardHomeComponent,  // Componente que será carregado quando a rota for acessada
  },
];
