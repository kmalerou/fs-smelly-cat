import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) return value;
    const phone = value.replace(/\s+/g, '');
    const countryCode = phone.slice(0, 3);
    const cityCode = phone.slice(3, 6);
    const midSection = phone.slice(6, 9);
    const rest = phone.slice(9);
    return `${countryCode} ${cityCode} ${midSection} ${rest}`;
  }
}
