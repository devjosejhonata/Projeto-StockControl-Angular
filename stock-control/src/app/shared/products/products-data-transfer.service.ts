import { Injectable } from '@angular/core';
// Importa o decorador Injectable do Angular para permitir a injeção de dependências
import { BehaviorSubject, map, take } from 'rxjs';
// Importa BehaviorSubject, map e take do RxJS para gerenciamento de estado e manipulação de fluxos de dados
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
// Importa a interface GetAllProductsResponse para tipagem de dados

@Injectable({
  providedIn: 'root' // Define que o serviço é fornecido no nível da raiz da aplicação
})
export class ProductsDataTransferService {

  public productsDataEmitters$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  // Cria um BehaviorSubject que armazena o estado atual dos produtos. Inicialmente é nulo.

  public productsDatas: Array<GetAllProductsResponse> = [];
  // Array que armazenará a lista de produtos filtrados com base na quantidade

  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    // Método para definir os dados dos produtos // Recebe um array de produtos como parâmetro
    
    if(products) {
      // Verifica se a lista de produtos não é nula
      this.productsDataEmitters$.next(products);
      // Atualiza o valor do BehaviorSubject com a nova lista de produtos
      this.getProductsDatas();
      // Chama o método para obter e filtrar os dados dos produtos
    }
  }

  getProductsDatas() {
    // Método para obter e filtrar os dados dos produtos
    this.productsDataEmitters$
    .pipe(
      take(1),
      // Garante que apenas o primeiro valor emitido pelo BehaviorSubject seja tomado
      map((data) => data?.filter((product) => product.amount > 0))
      // Filtra a lista de produtos para incluir apenas aqueles com quantidade maior que 0
    )
      .subscribe({
        next: (response) => {
          // Recebe a lista filtrada de produtos
          if (response) {
            this.productsDatas = response;
            // Atualiza a propriedade productsDatas com a lista filtrada
          }
        }
      });
      return this.productsDatas;
      // Retorna a lista de produtos filtrada
  }
}
