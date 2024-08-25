import { HttpClient, HttpHeaders } from '@angular/common/http';
// Importa HttpClient para fazer requisições HTTP e HttpHeaders para definir cabeçalhos HTTP
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// Importa o serviço para manipulação de cookies
import { map, Observable } from 'rxjs';
// Importa operadores e Observable do RxJS para manipulação de fluxos de dados assíncronos
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
// Importa a interface para criar produtos
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';
// Importa a interface para venda de produtos
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
// Importa a interface de resposta ao criar produtos
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
// Importa a interface de resposta ao obter todos os produtos
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/SaleProductResponse';
// Importa a interface de resposta ao vender produtos
import { environment } from 'src/environments/environments';
// Importa as variáveis de ambiente, incluindo a URL da API

@Injectable({
  providedIn: 'root', // Define que o serviço estará disponível em toda a aplicação
})
export class ProductsService {
  private API_URL = environment.API_URL; // URL base da API, obtida das variáveis de ambiente
  private JWT_TOKEN = this.cookie.get('USER_INFO'); // Obtém o token JWT armazenado nos cookies para autenticação
  private httpOptions = { // Configura opções padrão para as requisições HTTP
    headers: new HttpHeaders({ // Define os cabeçalhos da requisição
      'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
      Authorization: `Bearer ${this.JWT_TOKEN}`, // Adiciona o token JWT ao cabeçalho de autorização
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {} // Injeta HttpClient e CookieService no construtor

  // Método para buscar todos os produtos do backend e filtrar aqueles com quantidade maior que zero
  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/products`, // URL para obter todos os produtos
        this.httpOptions // Opções de configuração da requisição, incluindo cabeçalhos
      )
      .pipe(map((product) => product.filter((data) => data?.amount > 0)));
      // Filtra produtos para exibir apenas aqueles com quantidade maior que zero
  }

  // Método para deletar um produto específico
  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`, // URL para deletar o produto
      {
        ...this.httpOptions, // Inclui as opções de cabeçalhos
        params: { // Adiciona parâmetros à URL da requisição
          product_id: product_id, // ID do produto a ser excluído
        },
      }
    );
  }

  // Método para criar um novo produto
  createProduct(
    requestDatas: CreateProductRequest
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`, // URL para criar o produto
      requestDatas, // Dados do produto a serem enviados no corpo da requisição
      this.httpOptions // Opções de configuração da requisição, incluindo cabeçalhos
    );
  }

  // Método para editar um produto existente
  editProduct(requestDatas: EditProductRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/product/edit`, // URL para editar o produto
      requestDatas, // Dados atualizados do produto a serem enviados no corpo da requisição
      this.httpOptions // Opções de configuração da requisição, incluindo cabeçalhos
    );
  }

  // Método para registrar a venda de um produto
  saleProduct(requestDatas: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(
      `${this.API_URL}/product/sale`, // URL para registrar a venda do produto
      {
        amount: requestDatas?.amount, // Quantidade do produto vendida
      },
      {
        ...this.httpOptions, // Inclui as opções de cabeçalhos
        params: { // Adiciona parâmetros à URL da requisição
          product_id: requestDatas?.product_id, // ID do produto vendido
        },
      }
    );
  }
}
