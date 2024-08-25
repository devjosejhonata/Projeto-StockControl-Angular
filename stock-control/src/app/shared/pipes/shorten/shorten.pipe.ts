import { Pipe, PipeTransform } from '@angular/core';
// Importa o decorador Pipe e a interface PipeTransform do Angular

@Pipe({
  name: 'shorten' // Define o nome do pipe como 'shorten', que será usado em templates para aplicar o pipe
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, args: number): string {
    // Método que realiza a transformação no valor do pipe
    // Recebe um valor do tipo string e um argumento do tipo number

    if (value !== null) {
      // Verifica se o valor não é nulo
      return value.length > args ? value.substring(0, args) + '...' : value;
      // Se o comprimento do valor for maior que o argumento,
      // retorna uma substring do valor com o comprimento especificado e adiciona '...'
      // Caso contrário, retorna o valor completo
    }

    return '';
    // Se o valor for nulo, retorna uma string vazia
  }

}
