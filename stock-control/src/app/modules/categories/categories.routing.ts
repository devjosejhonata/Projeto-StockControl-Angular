// Importação dos módulos necessários para definir rotas no Angular
import { Routes } from "@angular/router";
import { CategoriesHomeComponent } from "./pages/categories-home/categories-home.component";

// Definição das rotas específicas para o módulo de categorias
export const CATEGORIES_ROUTES: Routes = [
  {
    // Rota padrão, que será ativada quando o caminho estiver vazio
    path: '',
    component: CategoriesHomeComponent,  // Componente que será carregado para essa rota
  }
]
