import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasAcceptedValidator(
  errorKey: string = 'hasNotAccepted',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasAccepted = control.value;
    return hasAccepted ? null : { [errorKey]: true };
  };
}
