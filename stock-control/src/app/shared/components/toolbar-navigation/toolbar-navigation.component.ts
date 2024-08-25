import { Router } from '@angular/router'; // Importa o serviço Router do Angular para navegação entre rotas
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
// Importa o serviço DialogService do PrimeNG para gerenciar diálogos
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';
// Importa o componente ProductFormComponent para exibição em um diálogo
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
// Importa o enum ProductEvent para uso em ações de produtos

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {

  constructor(
    private cookie: CookieService, // Injeta o serviço CookieService
    private router: Router, // Injeta o serviço Router
    private dialogService: DialogService // Injeta o serviço DialogService
  ) {}

  handleLogout(): void {// Método para realizar logout e redirecionar o usuário para a tela de login

    // Remove o cookie 'USER_INFO' para efetuar o logout
    this.cookie.delete('USER_INFO');

    // Redireciona o usuário para a rota '/home'
    void this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {// Método para abrir um diálogo para realizar uma venda de produto
    
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT; // Define a ação de venda do produto

    // Abre o diálogo com o componente ProductFormComponent
    this.dialogService.open(ProductFormComponent, {
      header: saleProductAction, // Define o cabeçalho do diálogo com a ação de venda
      width: '70%', // Define a largura do diálogo como 70% da largura da tela
      contentStyle: {overflow: 'auto'}, // Define o estilo do conteúdo do diálogo para permitir rolagem se necessário
      baseZIndex: 10000, // Define o índice z-base para garantir que o diálogo fique sobre outros elementos
      maximizable: true, // Permite que o diálogo seja maximizado
      data: {
        event: { action: saleProductAction }, // Passa dados para o diálogo, incluindo a ação de venda do produto
      },
    });
  }
}
