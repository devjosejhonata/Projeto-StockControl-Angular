// Importação dos módulos e classes necessários para o funcionamento do AuthGuard
import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// O decorator @Injectable faz com que o Angular entenda que esta classe pode ter dependências injetadas
@Injectable({
  providedIn: 'root', // Isso significa que o serviço será fornecido em toda a aplicação
})
export class AuthGuard {

  // Construtor da classe, onde os serviços UserService e Router são injetados
  constructor(private userService: UserService, private router: Router) {}

  // Método canActivate, que determina se a rota pode ser ativada
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    // Verifica se o usuário não está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redireciona para a página inicial ('/home')
      this.router.navigate(['/home']);
      
      return false;
    }

    // Se o usuário estiver logado, apenas retorna true, permitindo o acesso à rota
    return true;
  }
}
