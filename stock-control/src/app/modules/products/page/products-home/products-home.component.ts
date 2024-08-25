import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// Importa serviços para manipulação de diálogos dinâmicos da biblioteca PrimeNG
import { ProductsService } from './../../../../services/products/products.service';
// Importa o serviço de produtos para interações com a API
import { Component, OnDestroy, OnInit } from '@angular/core';
// Importa os decorators e interfaces do Angular para o ciclo de vida do componente
import { Router } from '@angular/router';
// Importa o serviço de roteamento do Angular
import { ConfirmationService, MessageService } from 'primeng/api';
// Importa serviços de confirmação e mensagens da PrimeNG
import { Subject, takeUntil } from 'rxjs';
// Importa Subject e operador takeUntil para gerenciamento de assinaturas RxJS
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
// Importa a interface de ação de eventos
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
// Importa a interface de resposta de produtos
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
// Importa o serviço para transferência de dados de produtos
import { ProductFormComponent } from '../../components/product-form/product-form.component';
// Importa o componente do formulário de produtos para abertura em diálogo

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  // Define a classe do componente e implementa as interfaces OnInit e OnDestroy

  private readonly destroy$: Subject<void> = new Subject(); // Subject para gerenciar a limpeza de assinaturas
  private ref!: DynamicDialogRef; // Referência para o diálogo dinâmico
  public productsData: Array<GetAllProductsResponse> = []; // Array para armazenar os dados dos produtos

  constructor(
    private productsService: ProductsService, // Injeta o serviço de produtos
    private productsDtService: ProductsDataTransferService, // Injeta o serviço de transferência de dados de produtos
    private router: Router, // Injeta o serviço de roteamento
    private messageService: MessageService, // Injeta o serviço de mensagens
    private confirmationService: ConfirmationService, // Injeta o serviço de confirmação
    private dialogService: DialogService // Injeta o serviço de diálogos dinâmicos
  ) { }

  ngOnInit(): void {
    this.getServiceProductsDatas(); // Chama o método para carregar os dados dos produtos ao inicializar o componente
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas(); // Obtém os dados dos produtos do serviço de transferência

    if (productsLoaded.length > 0) { // Verifica se há produtos carregados
      this.productsData = productsLoaded; // Define os produtos carregados
      console.log('DADOS DE PRODUTOS', this.productsData); // Log para depuração
    } else this.getAPIProductsData(); // Se não houver produtos carregados, chama o método para buscar na API
  }

  getAPIProductsData() {
    this.productsService
    .getAllProducts() // Chama o serviço para obter todos os produtos da API
    .pipe(takeUntil(this.destroy$)) // Usa takeUntil para gerenciar a assinatura e evitar vazamento de memória
    .subscribe({
      next: (response) => { // Manipula a resposta da API
        if(response.length > 0) { // Verifica se a resposta contém produtos
          this.productsData = response; // Define os produtos recebidos
          console.log('DADOS DE PRODUTOS', this.productsData); // Log para depuração
        }
      },
      error: (err) => { // Manipula erros da chamada API
        console.log(err); // Log de erro
        this.messageService.add({ // Exibe uma mensagem de erro
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos',
          life: 2500,
        })
        this.router.navigate(['/dashboard']); // Redireciona para o dashboard em caso de erro
      }
    })
  }

  handleProductAction(event: EventAction): void {
    if(event) { // Verifica se o evento está definido
      this.ref = this.dialogService.open(ProductFormComponent, { // Abre o diálogo com o componente ProductFormComponent
        header: event?.action, // Define o cabeçalho do diálogo com a ação do evento
        width: '70%', // Define a largura do diálogo
        contentStyle: { overflow: 'auto '}, // Define o estilo de conteúdo do diálogo
        baseZIndex: 1000, // Define o índice z-base do diálogo
        maximizable: true, // Permite que o diálogo seja maximizado
        data: { // Passa dados para o componente do diálogo
          event: event,
          productDatas: this.productsData,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIProductsData(), // Recarrega os dados dos produtos quando o diálogo é fechado
      })
    }
  }

  handleDeleteProductAction(event: {
    product_id: string,
    productName: string
  }): void {
    if (event) { // Verifica se o evento de exclusão está definido
      this.confirmationService.confirm({ // Abre um diálogo de confirmação para exclusão
        message: `Confirma a exclusão do produto: ${event?.productName}`, // Mensagem a ser exibida
        header: 'Confirmação de exclusão', // Cabeçalho do diálogo de confirmação
        icon: 'pi pi-exclamation-triangle', // Ícone de alerta
        acceptLabel: 'Sim', // Rótulo do botão de aceitação
        rejectLabel: 'Não', // Rótulo do botão de rejeição
        accept: () => this.deleteProduct(event?.product_id), // Chama o método de exclusão se aceito
      })
    }
  }

  deleteProduct(product_id: string) {
    // Método que chama o backend para solicitar a remoção do produto
    if (product_id) { // Verifica se o ID do produto está definido
      this.productsService
      .deleteProduct(product_id) // Chama o serviço para excluir o produto
      .pipe(takeUntil(this.destroy$)) // Usa takeUntil para gerenciar a assinatura
      .subscribe({
        next: (response) => { // Manipula a resposta da exclusão
          if (response) { // Verifica se a resposta é bem-sucedida
            this.messageService.add({ // Exibe uma mensagem de sucesso
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto removido com sucesso!',
              life: 2500,
            });

            this.getAPIProductsData(); // Recarrega os dados dos produtos para refletir a exclusão
          }
        },
        error: (err) => { // Manipula erros da exclusão
          console.log(err); // Log de erro
          this.messageService.add({ // Exibe uma mensagem de erro
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao remover produto!',
            life: 2500,
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite um valor para notificar que o componente está sendo destruído
    this.destroy$.complete(); // Completa o Subject para liberar recursos
  }
}
