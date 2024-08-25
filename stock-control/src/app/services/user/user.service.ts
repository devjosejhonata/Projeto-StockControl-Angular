import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs'; // Importa Observable do RxJS para manipulação de fluxos de dados assíncronos
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
// Importa a interface para requisição de cadastro de usuário
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
// Importa a interface de resposta ao cadastrar um usuário
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
// Importa a interface para requisição de autenticação de usuário
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
// Importa a interface de resposta ao autenticar um usuário
import { environment } from 'src/environments/environments';
// Importa as variáveis de ambiente, incluindo a URL da API

@Injectable({
  providedIn: 'root', // Define que o serviço estará disponível em toda a aplicação
})
export class UserService {
  private API_URL = environment.API_URL; // URL base da API, obtida das variáveis de ambiente

  constructor(private http: HttpClient, private cookie: CookieService) {} // Injeta HttpClient e CookieService no construtor

  // Método para cadastrar um novo usuário
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/user`, // URL para cadastrar o usuário
      requestDatas // Dados do usuário a serem enviados no corpo da requisição
    );
  }

  // Método para autenticar um usuário
  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth`, // URL para autenticação do usuário
      requestDatas // Dados de autenticação a serem enviados no corpo da requisição
    );
  }

  // Método para verificar se o usuário está autenticado (verifica a presença do token JWT nos cookies)
  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO'); // Obtém o token JWT armazenado nos cookies
    return JWT_TOKEN ? true : false; // Retorna verdadeiro se o token estiver presente, caso contrário, falso
  }
}
