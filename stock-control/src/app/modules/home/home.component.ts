import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy /*AfterViewInit*/ {
  
  // Subject para gerenciar o ciclo de vida das assinaturas e evitar memory leaks
  private destroy$ = new Subject<void>();

  // Referências a elementos do DOM para manipulação direta
  @ViewChild('emailInput') public emailInputRef!: ElementRef;
  @ViewChild('passwordInput') public passwordInputRef!: ElementRef;

  // Controle para alternar entre o formulário de login e o de signup
  loginCard = true;

  // Definição do formulário de login com validações
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  // Definição do formulário de signup com validações
  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  /*
  // Método do ciclo de vida executado após a visualização ser inicializada
  ngAfterViewInit(): void {
    // Definição de valores padrões nos inputs de email e senha
    this.emailInputRef.nativeElement.value = 'Seu email aki';
    this.passwordInputRef.nativeElement.value = 'Sua senha aki';

    // Logs para depuração, mostrando os valores dos inputs
    console.log('EMAIL INPUT =>', this.emailInputRef.nativeElement.value);
    console.log('PASSWORD INPUT =>', this.passwordInputRef.nativeElement.value);
  }
  */

  // Método chamado ao submeter o formulário de login
  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      // Serviço de autenticação de usuário
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .pipe(takeUntil(this.destroy$)) // Gestão do ciclo de vida da assinatura
        .subscribe({
          next: (response) => {
            if (response) {
              // Salvando o token de usuário nos cookies
              this.cookieService.set('USER_INFO', response?.token);
              // Resetando o formulário
              this.loginForm.reset();
              // Navegando para a página do dashboard
              this.router.navigate(['/dashboard']);

              // Exibindo mensagem de sucesso
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000,
              });
            }
          },
          error: (err) => {
            // Exibindo mensagem de erro em caso de falha
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer o login!`,
              life: 2000,
            });
            console.log(err);
          },
        });
    }
  }

  // Método chamado ao submeter o formulário de signup
  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      // Serviço para criar novo usuário
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .pipe(takeUntil(this.destroy$)) // Gestão do ciclo de vida da assinatura
        .subscribe({
          next: (response) => {
            if (response) {
              // Resetando o formulário de signup
              this.signupForm.reset();
              // Alternando para o formulário de login após signup bem-sucedido
              this.loginCard = true;

              // Exibindo mensagem de sucesso
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000,
              });
            }
          },
          error: (err) => {
            // Exibindo mensagem de erro em caso de falha
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar usuário!`,
              life: 2000,
            });
            console.log(err);
          },
        });
    }
  }

  // Método do ciclo de vida chamado ao destruir o componente, usado para completar o Subject e liberar recursos
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
