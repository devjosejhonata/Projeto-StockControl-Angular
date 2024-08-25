import { HttpClient, HttpHeaders } from '@angular/common/http';
// Importa o HttpClient para fazer requisições HTTP e HttpHeaders para configurar cabeçalhos HTTP
import { Injectable } from '@angular/core';
// Importa o decorator Injectable para definir que a classe pode ser injetada como um serviço
import { CookieService } from 'ngx-cookie-service';
// Importa o serviço para manipulação de cookies
import { Observable } from 'rxjs';
// Importa Observable para trabalhar com streams de dados assíncronos
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
// Importa a interface de resposta de categorias
import { environment } from 'src/environments/environments';
// Importa o ambiente de configuração (URL da API)

// Define a classe como um serviço que pode ser injetado em outras partes da aplicação
@Injectable({
  providedIn: 'root' // Define que o serviço será disponibilizado em toda a aplicação
})
export class CategoriesService {
  private API_URL = environment.API_URL; // URL base da API, obtida do ambiente de configuração
  private JWT_TOKEN = this.cookie.get('USER_INFO'); // Obtém o token JWT do cookie para autenticação
  private httpOptions = { // Configura opções padrão para as requisições HTTP
    headers: new HttpHeaders ({ // Define os cabeçalhos da requisição
      'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
      Authorization: `Bearer ${this.JWT_TOKEN}`, // Adiciona o token JWT no cabeçalho de autorização
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) { } // Injeta HttpClient e CookieService no construtor

  // Método para criar uma nova categoria
  createNewCategory(requestDatas: {name: string;}): Observable<Array<GetCategoriesResponse>> {
    return this.http.post<Array<GetCategoriesResponse>>(
      `${this.API_URL}/category`, // URL para a criação de categorias
      requestDatas, // Dados da categoria a serem enviados no corpo da requisição
      this.httpOptions // Opções de configuração da requisição, incluindo cabeçalhos
    );
  }

  // Método para buscar todas as categorias do backend
  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`, // URL para obter a lista de categorias
      this.httpOptions // Opções de configuração da requisição, incluindo cabeçalhos
    );
  }

  // Método para deletar uma categoria
  deleteCategory(requestDatas: {category_id: string}): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, { // URL para deletar a categoria
      ...this.httpOptions, // Inclui as opções de cabeçalhos
      params: { // Adiciona parâmetros à URL da requisição
        category_id: requestDatas?.category_id, // ID da categoria a ser excluída
      }
    });
  }

  // Método para editar o nome de uma categoria
  editCategoryName(requestDatas: {
    name: string;
    category_id: string;
  }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`, // URL para editar a categoria
      {name: requestDatas?.name}, // Dados da categoria a serem enviados no corpo da requisição
      {
        ...this.httpOptions, // Inclui as opções de cabeçalhos
        params: { // Adiciona parâmetros à URL da requisição
          category_id: requestDatas?.category_id, // ID da categoria a ser editada
        },
      }
    );
  }
}
