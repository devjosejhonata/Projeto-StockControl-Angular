
import { Component, OnDestroy, OnInit } from '@angular/core';
// Módulos do Angular para criar componentes, gerenciar ciclo de vida e limpeza de recursos
import { FormBuilder, Validators } from '@angular/forms';
// Módulos para construção de formulários reativos e validações
import { Router } from '@angular/router';
// Módulo para navegação de rotas
import { MessageService } from 'primeng/api';
// Serviço do PrimeNG para exibição de mensagens (notificações)
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
// Configuração de diálogos dinâmicos do PrimeNG
import { Subject, takeUntil } from 'rxjs';
// Módulos do RxJS para gerenciar observáveis e destruir subscrições
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
// Enum para eventos relacionados a produtos
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
// Interface para a resposta de categorias
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
// Interface para ações de eventos
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
// Interface para a requisição de criação de produto
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
// Interface para a requisição de edição de produto
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';
// Interface para a requisição de venda de produto
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
// Interface para a resposta de produtos
import { CategoriesService } from 'src/app/services/categories/categories.service';
// Serviço para lidar com categorias
import { ProductsService } from 'src/app/services/products/products.service';
// Serviço para lidar com produtos
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
// Serviço para transferência de dados entre componentes

@Component({
  selector: 'app-product-form', // Seletor do componente
  templateUrl: './product-form.component.html', // Template do componente
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {

  // Subject que será utilizado para destruir observáveis e evitar vazamento de memória
  private readonly destroy$: Subject<void> = new Subject();

  // Array para armazenar as categorias recebidas do serviço
  public categoriesDatas: Array<GetCategoriesResponse> = [];

  // Array para armazenar a categoria selecionada
  public selectedCategory: Array<{ name: string; code: string }> = [];

  // Objeto para armazenar a ação e os dados do produto que estão sendo manipulados
  public productAction!: {
    event: EventAction
    productDatas: Array<GetAllProductsResponse>;
  };

  // Objeto para armazenar os dados do produto selecionado
  public productSelectedDatas!: GetAllProductsResponse;

  // Array para armazenar todos os produtos recebidos do serviço
  public productsDatas: Array<GetAllProductsResponse> = [];

  // Formulário reativo para adicionar um novo produto
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required], // Campo 'amount' com valor inicial de 0
  });

  // Formulário reativo para editar um produto existente
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  // Formulário reativo para venda de produto
  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required]
  });

  // Armazena os dados do produto selecionado para venda
  public saleProductSelect!: GetAllProductsResponse;

  // Controle para exibição de dropdowns no template
  public renderDropdown = false;

  // Eventos de produto
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT; // Ação para adicionar produto
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT; // Ação para editar produto
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT; // Ação para vender produto

  // Construtor do componente que injeta os serviços necessários
  constructor(
    private categoriesService: CategoriesService, // Serviço de categorias
    private productsService: ProductsService, // Serviço de produtos
    private productsDtService: ProductsDataTransferService, // Serviço de transferência de dados entre componentes
    private formBuilder: FormBuilder, // FormBuilder para construir formulários reativos
    private messageService: MessageService, // Serviço para exibir mensagens
    private router: Router, // Serviço para navegação de rotas
    public ref: DynamicDialogConfig // Configurações de diálogo dinâmico
  ) {}

  // Método que será executado quando o componente for inicializado
  ngOnInit(): void {
    this.productAction = this.ref.data; // Ação do produto passada através da configuração do diálogo

    // Se a ação for de venda, buscar os dados dos produtos
    this.productAction?.event?.action === this.saleProductAction && this.getProductDatas();

    // Buscar todas as categorias ao inicializar o componente
    this.getAllCategories();
    this.renderDropdown = true; // Habilitar a exibição de dropdowns
  }

  // Método para buscar todas as categorias
  getAllCategories(): void {
    this.categoriesService
      .getAllCategories() // Chama o serviço para buscar categorias
      .pipe(takeUntil(this.destroy$)) // Destrói a subscrição quando o componente for destruído
      .subscribe({
        next: (response) => { // Quando a resposta for recebida
          if (response.length > 0) { // Se houver categorias na resposta
            this.categoriesDatas = response; // Armazenar as categorias recebidas

            // Se a ação for de edição e existirem dados de produto, buscar os dados do produto selecionado
            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string);
           }
          }
        },
      });
  }

  // Método para submeter o formulário de adição de produto
  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) { // Verifica se o formulário é válido
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string, // Pega o valor do campo 'name'
        price: this.addProductForm.value.price as string, // Pega o valor do campo 'price'
        description: this.addProductForm.value.description as string, // Pega o valor do campo 'description'
        category_id: this.addProductForm.value.category_id as string, // Pega o valor do campo 'category_id'
        amount: Number(this.addProductForm.value.amount), // Converte o valor do campo 'amount' para número
      };

      this.productsService
        .createProduct(requestCreateProduct) // Chama o serviço para criar um novo produto
        .pipe(takeUntil(this.destroy$)) // Destrói a subscrição quando o componente for destruído
        .subscribe({
          next: (response) => {
            if (response) { // Se a resposta for bem-sucedida
              this.messageService.add({
                severity: 'success', // Mensagem de sucesso
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500, // Tempo de exibição da mensagem
              });
            }
          },
          error: (err) => { // Se houver erro
            console.log(err); // Loga o erro no console
            this.messageService.add({
              severity: 'error', // Mensagem de erro
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500, // Tempo de exibição da mensagem
            });
          },
        });
    }

    this.addProductForm.reset(); // Limpa os campos do formulário
  }

  // Método para submeter o formulário de edição de produto
  handleSubmitEditProduct(): void {
     if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id // Verifica se o formulário é válido e se existe um ID de produto
     ) {
       const requestEditProduct: EditProductRequest = {
         name: this.editProductForm.value.name as string, // Pega o valor do campo 'name'
         price: this.editProductForm.value.price as string, // Pega o valor do campo 'price'
         description: this.editProductForm.value.description as string, // Pega o valor do campo 'description'
         product_id: this.productAction?.event?.id, // Pega o ID do produto que está sendo editado
         amount: this.editProductForm.value.amount as number, // Converte o valor do campo 'amount' para número
         category_id: this.editProductForm.value.category_id as string // Pega o valor do campo 'category_id'
       };

       this.productsService
         .editProduct(requestEditProduct) // Chama o serviço para editar o produto
         .pipe(takeUntil(this.destroy$)) // Destrói a subscrição quando o componente for destruído
         .subscribe({
           next: () => {
             this.messageService.add ({
                severity: 'success', // Mensagem de sucesso
                summary: 'Sucesso',
                detail: 'Produto editado com sucesso!',
                life: 2500 // Tempo de exibição da mensagem
             });
             this.editProductForm.reset(); // Limpa os campos do formulário
           },
           error: (err) => { // Se houver erro
            console.log(err); // Loga o erro no console
            this.messageService.add({
              severity: 'error', // Mensagem de erro
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500 // Tempo de exibição da mensagem
            });
            this.editProductForm.reset(); // Limpa os campos do formulário
           },
         });

     }
  }

  // Método para submeter o formulário de venda de produto
  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm?.valid) { // Verifica se o formulário é válido
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number, // Pega o valor do campo 'amount' e converte para número
        product_id: this.saleProductForm.value?.product_id as string, // Pega o valor do campo 'product_id'
      };

      this.productsService
        .saleProduct(requestDatas) // Chama o serviço para registrar a venda do produto
        .pipe(takeUntil(this.destroy$)) // Destrói a subscrição quando o componente for destruído
        .subscribe({
          next: (response) => {
            if (response) { // Se a resposta for bem-sucedida
              this.messageService.add({
                severity: 'success', // Mensagem de sucesso
                summary: 'Sucesso',
                detail: 'Venda efetuada com sucesso!',
                life: 3000, // Tempo de exibição da mensagem
              });
              this.saleProductForm.reset(); // Limpa os campos do formulário
              this.getProductDatas(); // Atualiza os dados do produto
              this.router.navigate(['/dashboard']); // Navega para a página de dashboard
            }
          },
          error: (err) => { // Se houver erro
            console.log(err); // Loga o erro no console
            this.saleProductForm.reset(); // Limpa os campos do formulário
            this.messageService.add({
              severity: 'error', // Mensagem de erro
              summary: 'Erro',
              detail: 'Erro ao vender produto!',
              life: 3000, // Tempo de exibição da mensagem
            });
          },
        });
    }
  }

  // Método para buscar os dados do produto selecionado para edição
  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas; // Armazena todos os produtos disponíveis

    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId // Filtra os produtos para encontrar aquele com o ID correspondente
      );

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0]; // Armazena os dados do produto selecionado

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name, // Define o campo 'name' no formulário
          price: this.productSelectedDatas?.price, // Define o campo 'price' no formulário
          amount: this.productSelectedDatas?.amount, // Define o campo 'amount' no formulário
          description: this.productSelectedDatas?.description, // Define o campo 'description' no formulário
          category_id: this.productSelectedDatas?.category?.id // Define o campo 'category_id' no formulário
        });
      }
    }
  }

  // Método para buscar todos os produtos
  getProductDatas(): void {
    this.productsService.getAllProducts() // Chama o serviço para buscar todos os produtos
    .pipe(takeUntil(this.destroy$)) // Destrói a subscrição quando o componente for destruído
    .subscribe({
      next: (response) => {
        if (response.length > 0) { // Se houver produtos na resposta
          this.productsDatas = response; // Armazena os produtos recebidos
          this.productsDatas && this.productsDtService.setProductsDatas(this.productsDatas); // Transfere os dados dos produtos entre componentes
        }
      }
    });
  }

  // Método que será executado quando o componente for destruído
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite um valor para encerrar todas as subscrições
    this.destroy$.complete(); // Completa o Subject para liberar recursos
  }
}
