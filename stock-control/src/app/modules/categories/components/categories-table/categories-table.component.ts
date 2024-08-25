// Importações de módulos essenciais e interfaces necessários para o componente
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/Event/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/Event/EditCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',  // Define o seletor que identifica o componente no HTML
  templateUrl: './categories-table.component.html',  // Localização do template HTML do componente
  styleUrls: []  // Estilos CSS para o componente (vazio neste caso)
})
export class CategoriesTableComponent {

   // Propriedade de entrada que recebe uma lista de categorias
   @Input() public categories: Array<GetCategoriesResponse> = [];

   // Eventos de saída que emitem ações de edição e exclusão de categorias
   @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();
   @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

   // Armazena a categoria selecionada pelo usuário
   public categorySelected!: GetCategoriesResponse;

   // Propriedades para representar as ações de adicionar e editar categorias
   public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
   public EditCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

   // Método que trata o evento de exclusão de uma categoria, emitindo o evento correspondente
   handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if (category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({ category_id, categoryName });
    }
   }

   // Método que trata diferentes ações de categoria (adicionar ou editar), emitindo o evento correspondente
   handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
   }
}
