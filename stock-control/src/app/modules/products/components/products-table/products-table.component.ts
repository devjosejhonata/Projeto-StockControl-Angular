import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent'; // Importa o enum para eventos de produtos
import { DeleteProductAction } from 'src/app/models/interfaces/event/DeleteProductAction'; // Importa a interface para ação de exclusão de produto
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse'; // Importa a interface para resposta de produtos

@Component({
  selector: 'app-products-table', // Seletor do componente para uso em templates HTML
  templateUrl: './products-table.component.html', // URL do template HTML do componente
  styleUrls: []
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = []; // Recebe a lista de produtos do componente pai
  @Output() productEvent = new EventEmitter<EventAction>(); // Emite eventos relacionados a ações de produtos
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>(); // Emite eventos relacionados à exclusão de produtos

  public productSelected!: GetAllProductsResponse; // Armazena o produto atualmente selecionado
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT; // Evento para adicionar um produto
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT; // Evento para editar um produto

  handleProductEvent(action: string, id?: string): void {
    // Método para emitir eventos de produto com base na ação e, opcionalmente no ID do produto
    if(action && action !== '') { // Verifica se a ação não é vazia
      const productEventData = id && id !== '' ? { action, id } : { action }; // Cria o objeto de dados do evento com ou sem ID

      // Emite o valor do evento para o componente pai
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(product_id: string, productName: string): void {
    // Método para emitir evento de exclusão de produto com base no ID e nome do produto
    if (product_id !== '' && productName !== '') { // Verifica se o ID e o nome do produto não são vazios
      this.deleteProductEvent.emit({
        product_id, // ID do produto a ser excluído
        productName // Nome do produto a ser excluído
      });
    }
  }
}
