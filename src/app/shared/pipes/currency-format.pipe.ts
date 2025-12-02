import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: number | string, 
    currencyCode: string = 'USD', 
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digitsInfo: string = '1.2-2'
  ): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return 'N/A';
    }

    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(numValue);
  }
}
