import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  // Subject para controle de ciclo de vida do componente, usado para cancelar assinaturas e evitar vazamentos de memória
  private destroy$ = new Subject<void>();

  // Array para armazenar a lista de produtos retornados do servidor
  public productsList: Array<GetAllProductsResponse> = [];

  // Configurações dos dados e opções do gráfico de produtos
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private productsService: ProductsService,  // Serviço para realizar operações relacionadas aos produtos
    private messageService: MessageService,  // Serviço para exibir mensagens de feedback ao usuário
    private productsDtService: ProductsDataTransferService  // Serviço para transferir dados de produtos entre componentes
  ) {}

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    this.getProductsDatas();  // Busca os dados dos produtos ao iniciar o componente
  }

  // Método para buscar os dados de todos os produtos do servidor
  getProductsDatas(): void {
    this.productsService
      .getAllProducts()  // Chama o serviço para buscar todos os produtos
      .pipe(takeUntil(this.destroy$))  // Cancela a assinatura se o componente for destruído
      .subscribe({
        next: (response) => {  // Em caso de sucesso na resposta
          if (response.length > 0) {
            this.productsList = response;  // Atualiza a lista de produtos com os dados retornados
            this.productsDtService.setProductsDatas(this.productsList);  // Transfere os dados dos produtos para outro serviço
            this.setProductsChartConfig();  // Configura o gráfico dos produtos com os dados obtidos
          }
        },
        error: (err) => {  // Em caso de erro na resposta
          console.log(err);
          this.messageService.add({  // Exibe mensagem de erro
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
            life: 2500,
          });
        },
      });
  }

  // Método para configurar os dados e opções do gráfico de produtos
  setProductsChartConfig(): void {
    if (this.productsList.length > 0) {
      // Obtém estilos do documento atual para configurar cores no gráfico
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // Configuração dos dados do gráfico com base nos produtos obtidos
      this.productsChartDatas = {
        labels: this.productsList.map((element) => element?.name),  // Labels são os nomes dos produtos
        datasets: [
          {
            label: 'Quantidade',  // Rótulo do dataset
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),  // Cor de fundo das barras
            borderColor: documentStyle.getPropertyValue('--indigo-400'),  // Cor da borda das barras
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),  // Cor de fundo ao passar o mouse sobre as barras
            data: this.productsList.map((element) => element?.amount),  // Dados do gráfico são as quantidades dos produtos
          },
        ],
      };

      // Configurações do gráfico, incluindo cores e estilos das escalas e legendas
      this.productsChartOptions = {
        maintainAspectRatio: false,  // Mantém ou não a proporção do gráfico
        aspectRatio: 0.8,  // Define a proporção do gráfico
        plugins: {
          legend: {
            labels: {
              color: textColor,  // Cor do texto da legenda
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: textColorSecondary,  // Cor do texto dos ticks (marcadores) do eixo X
              font: {
                weight: 'bold'  // Fonte em negrito para os ticks do eixo X
              },
            },
            grid: {
              color: surfaceBorder,  // Cor da grade do eixo X
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,  // Cor do texto dos ticks (marcadores) do eixo Y
            },
            grid: {
              color: surfaceBorder,  // Cor da grade do eixo Y
            },
          },
        },
      };
    }
  }

  // Método chamado quando o componente é destruído para liberar recursos e evitar vazamentos de memória
  ngOnDestroy(): void {
    this.destroy$.next();  // Emite o valor de destruição para cancelar assinaturas ativas
    this.destroy$.complete();  // Completa o Subject para encerrar seu ciclo de vida
  }
}
