import { Pipe, PipeTransform } from '@angular/core';
import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(
    value: Date | string | number,
    formatType: 'short' | 'medium' | 'long' | 'full' | 'relative' | 'distance' | 'custom' = 'medium',
    customFormat?: string
  ): string {
    if (!value) return '';

    let date: Date;
    
    if (typeof value === 'string') {
      date = parseISO(value);
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else {
      date = value;
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    switch (formatType) {
      case 'short':
        return format(date, 'dd/MM/yyyy', { locale: es });
      case 'medium':
        return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
      case 'long':
        return format(date, "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
      case 'full':
        return format(date, "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
      case 'relative':
        return formatRelative(date, new Date(), { locale: es });
      case 'distance':
        return formatDistance(date, new Date(), { 
          addSuffix: true, 
          locale: es 
        });
      case 'custom':
        return customFormat ? format(date, customFormat, { locale: es }) : format(date, 'dd/MM/yyyy', { locale: es });
      default:
        return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
    }
  }
}
