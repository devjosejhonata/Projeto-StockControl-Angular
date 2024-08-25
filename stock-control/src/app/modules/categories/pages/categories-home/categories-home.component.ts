//Importações necessárias no component
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/Event/DeleteCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  // Subject para controle de ciclo de vida do componente, usado para cancelar assinaturas e evitar vazamentos de memória
  private readonly destroy$: Subject<void> = new Subject();

  // Referência ao diálogo dinâmico usado para criar/editar categorias
  private ref!: DynamicDialogRef;

  // Lista de categorias que serão exibidas na tabela
  public categoriesDatas: Array<GetCategoriesResponse> = [];

  constructor(
    private categoriesService: CategoriesService,  // Serviço responsável por operações relacionadas a categorias
    private dialogService: DialogService,  // Serviço responsável por abrir diálogos modais dinâmicos
    private messageService: MessageService,  // Serviço para exibir mensagens de feedback ao usuário
    private confirmationService: ConfirmationService,  // Serviço para exibir caixas de diálogo de confirmação
    private router: Router  // Serviço de navegação para redirecionar o usuário entre páginas
  ) {}

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    this.getAllCategories();  // Carrega todas as categorias ao iniciar o componente
  }

  // Método para buscar todas as categorias do servidor
  getAllCategories() {
    this.categoriesService
    .getAllCategories()  // Chama o serviço para buscar todas as categorias
    .pipe(takeUntil(this.destroy$))  // Cancela a assinatura se o componente for destruído
    .subscribe({
       next: (response) => {  // Em caso de sucesso na resposta
         if (response.length > 0) {
           this.categoriesDatas = response;  // Atualiza a lista de categorias
         }
       },
       error: (err) => {  // Em caso de erro na resposta
          console.log(err);
          this.messageService.add({  // Exibe mensagem de erro
             severity: 'error',
             summary: 'Erro',
             detail: 'Erro ao buscar categorias!',
             life: 300
          });
          this.router.navigate(['/dashboard']);  // Redireciona para o dashboard em caso de erro
       }
    })
  }

  // Método para tratar o evento de exclusão de uma categoria
  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria: ${event?.categoryName}`,  // Mensagem de confirmação
        header: 'Confirmação de exclusão',  // Cabeçalho da caixa de diálogo
        icon: 'pi pi-exclamation-triangle',  // Ícone exibido na caixa de diálogo
        acceptLabel: 'Sim',  // Texto do botão de aceitar
        rejectLabel: 'Não',  // Texto do botão de rejeitar
        accept: () => this.deleteCategory(event?.category_id)  // Chama o método de exclusão se o usuário confirmar
      })
    }
  }

  // Método para deletar uma categoria, chamando o serviço correspondente
  deleteCategory(category_id: string): void {
     if (category_id) {
        this.categoriesService
          .deleteCategory({category_id})  // Chama o serviço para deletar a categoria
          .pipe(takeUntil(this.destroy$))  // Cancela a assinatura se o componente for destruído
          .subscribe({
             next: (response) => {  // Em caso de sucesso na resposta
               this.getAllCategories();  // Atualiza a lista de categorias

               this.messageService.add({  // Exibe mensagem de sucesso
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria removida com sucesso',
                life: 2000,
               });

             },
             error: (err) => {  // Em caso de erro na resposta
               console.log(err);
               this.getAllCategories();  // Atualiza a lista de categorias mesmo em caso de erro

               this.messageService.add({  // Exibe mensagem de erro
                 severity: 'error',
                 summary: 'Erro',
                 detail: 'Erro ao remover categoria!',
                 life: 3000,
               });
             },
          });

          this.getAllCategories();  // Atualiza a lista de categorias após tentar a exclusão
     }
  }

  // Método para tratar eventos relacionados a categorias, como adicionar ou editar
  handleCategoryAction(event: EventAction): void {
    if (event) {
      // Abre o diálogo dinâmico para o formulário de categorias
      this.ref = this.dialogService.open(CategoryFormComponent, {
        header: event?.action,  // Define o título do diálogo com base na ação
        width: '70%',  // Define a largura do diálogo
        contentStyle: { overflow: 'auto' },  // Define o estilo de overflow para o conteúdo do diálogo
        baseZIndex: 10000,  // Define a ordem de sobreposição do diálogo
        maximizable: true,  // Permite maximizar o diálogo
        data: {
          event: event,  // Passa o evento como dados para o componente de formulário
        },
      });

      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAllCategories(),  // Atualiza a lista de categorias após o diálogo ser fechado
      });
    }
  }

  // Método chamado quando o componente é destruído para liberar recursos e evitar vazamentos de memória
  ngOnDestroy(): void {
    this.destroy$.next();  // Emite o valor de destruição para cancelar assinaturas ativas
    this.destroy$.complete();  // Completa o Subject para encerrar seu ciclo de vida
  }

}
