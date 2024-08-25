// Importações de módulos e serviços necessários para o funcionamento do componente
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/Event/EditCategoryAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-category-form',  // Define o seletor que identifica o componente no HTML
  templateUrl: './category-form.component.html',  // Localização do template HTML do componente
  styleUrls: []  // Estilos CSS para o componente (vazio neste caso)
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  // Subject utilizado para gerenciar a destruição de subscriptions (evita memory leaks)
  private readonly destroy$: Subject<void> = new Subject();

  // Propriedades adicionar ou editar
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  // Armazena a ação de categoria recebida via DynamicDialogConfig
  public categoryAction!: {event: EditCategoryAction};

  // Formulário para entrada de dados da categoria com validação
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],  // Campo 'name' é obrigatório
  })

  // Injeção de dependências necessárias
  constructor(
    public ref: DynamicDialogConfig,          // Configuração do diálogo dinâmico, que traz dados como o evento de categoria
    private formBuilder: FormBuilder,         // Utilizado para construir o formulário reativo
    private messageService: MessageService,   // Serviço para exibir mensagens de feedback ao usuário
    private categoriesService: CategoriesService // Serviço para interagir com a API de categorias
  ) {}

  // Método que é executado ao inicializar o componente
  ngOnInit(): void {
     this.categoryAction = this.ref.data;  // Recupera a ação de categoria passada como dado no DynamicDialogConfig

     // Verifica se a ação é de edição e se o nome da categoria está presente
     if (this.categoryAction?.event?.action === this.editCategoryAction && this.categoryAction?.event.categoryName !== null || undefined) {
      this.setCategoryName(this.categoryAction?.event?.categoryName as string);  // Define o nome da categoria no formulário
     }
  }

  // Método para manipular o envio do formulário, decidindo se a ação é de adicionar ou editar
  handleSubmitCategoryAction(): void {
    if (this.categoryAction?.event.action === this.addCategoryAction) {
      this.handleSubmiteAddCategory();  // Chama a função de adicionar categoria
    } else if (this.categoryAction?.event?.action === this.editCategoryAction) {
      this.handleSubmiteEditCategory();  // Chama a função de editar categoria
    }
  }

  // Método para adicionar uma nova categoria
  handleSubmiteAddCategory(): void {
    if(this.categoryForm?.value && this.categoryForm?.valid) {  // Verifica se o formulário é válido
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string  // Cria o objeto de requisição para criar categoria
      };

      this.categoriesService
        .createNewCategory(requestCreateCategory)  // Chama o serviço para criar nova categoria
        .pipe(takeUntil(this.destroy$))  // Encerra a subscription ao destruir o componente
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset()  // Reseta o formulário em caso de sucesso
              this.messageService.add({
                severity: 'success',  // Exibe mensagem de sucesso
                summary: 'Sucesso',
                detail: 'Categoria criada com sucesso!',
                life: 3000,  // Duração da mensagem
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();  // Reseta o formulário em caso de erro
            this.messageService.add({
              severity: 'error',  // Exibe mensagem de erro
              summary: 'Erro',
              detail: 'Erro ao criar categoria',
              life: 3000,  // Duração da mensagem
            });
          },
        });
    }
  }

  // Método para editar uma categoria existente
  handleSubmiteEditCategory(): void {
    if(this.categoryForm?.value && this.categoryForm?.valid && this.categoryAction?.event?.id) {  // Verifica se o formulário é válido e possui um ID de categoria

      const requestEditCategory: {name: string; category_id: string; } = {
        name: this.categoryForm?.value?.name as string,  // Cria o objeto de requisição para editar categoria
        category_id: this.categoryAction?.event?.id
      }

      this.categoriesService
        .editCategoryName(requestEditCategory)  // Chama o serviço para editar a categoria
        .pipe(takeUntil(this.destroy$))  // Encerra a subscription ao destruir o componente
        .subscribe({
           next: () => {
             this.categoryForm.reset();  // Reseta o formulário em caso de sucesso
             this.messageService.add({
               severity: 'success',  // Exibe mensagem de sucesso
               summary: 'Sucesso',
               detail: 'Categoria editada com sucesso!',
               life: 3000,  // Duração da mensagem
             });
           },
           error: (err) => {
              console.log(err);
              this.categoryForm.reset();  // Reseta o formulário em caso de erro
              this.messageService.add({
                 severity: 'error',  // Exibe mensagem de erro
                 summary: 'Erro',
                 detail: 'Erro ao editar categoria!',
                 life: 3000,  // Duração da mensagem
              });
           },
        });
    }
  }

  // Método que define o nome da categoria no formulário, utilizado ao editar uma categoria existente
  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName,  // Define o valor do campo 'name' no formulário
      });
    }
  }

  // Método que é executado ao destruir o componente, garantindo a liberação de recursos
  ngOnDestroy(): void {
     this.destroy$.next();  // Emite o evento de destruição para encerrar observáveis
     this.destroy$.complete();  // Completa o Subject para finalizar todas as subscriptions
  }

}
