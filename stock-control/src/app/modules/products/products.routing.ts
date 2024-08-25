import { Routes } from "@angular/router";
// Importa o tipo Routes do módulo Angular Router para definir rotas

import { ProductsHomeComponent } from "./page/products-home/products-home.component";
// Importa o componente ProductsHomeComponent que será usado na rota

export const PRODUCTS_ROUTES: Routes = [ // Define e exporta uma constante PRODUCTS_ROUTES do tipo Routes
  {
    path: '', // Define o caminho da rota; uma string vazia indica a rota padrão para este módulo
    component: ProductsHomeComponent // Associa o caminho da rota ao componente ProductsHomeComponent
  }
]
