import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
// Importa RouterModule e PreloadingStrategy para configuração e otimização das rotas
import { HomeComponent } from './modules/home/home.component';
// Importa o componente HomeComponent para a rota /home
import { AuthGuard } from './guards/auth-guard.service';
// Importa o serviço AuthGuard para proteção de rotas

// Define as rotas da aplicação
const routes: Routes = [
  {
    path: '', // Rota vazia, padrão da aplicação
    redirectTo: 'dashboard', // Redireciona para a rota 'dashboard'
    pathMatch: 'full', // Garante que a rota vazia será completamente correspondida
  },
  {
    path: 'home', // Rota para o componente HomeComponent
    component: HomeComponent,
  },
  {
    path: 'dashboard', // Rota para o módulo Dashboard, carregado sob demanda
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard] // Protege a rota com o AuthGuard
  },
  {
    path: 'products', // Rota para o módulo Products, carregado sob demanda
    loadChildren: () =>
      import('./modules/products/products.module').then((m) => m.ProductsModule),
    canActivate: [AuthGuard] // Protege a rota com o AuthGuard
  },
  {
    path: 'categories', // Rota para o módulo Categories, carregado sob demanda
    loadChildren: () =>
      import('./modules/categories/categories.module').then((m) => m.CategoriesModule),
    canActivate: [AuthGuard] // Protege a rota com o AuthGuard
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, // Configura a estratégia de pré-carregamento para carregar todos os módulos assim que possível
  })],
  exports: [RouterModule], // Exporta RouterModule para que as rotas possam ser usadas em outros módulos
})
export class AppRoutingModule {} // Define o módulo de roteamento da aplicação
