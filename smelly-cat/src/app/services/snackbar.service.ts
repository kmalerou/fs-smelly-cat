import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private _verticalPosition: MatSnackBarVerticalPosition = 'top';
  private _durationMS = 3000;
  private _snackBar = inject(MatSnackBar);

  public openDefaultSnackbar(message: string): void {
    this._snackBar.open(message, 'Close', {
      horizontalPosition: this._horizontalPosition,
      verticalPosition: this._verticalPosition,
      duration: this._durationMS,
    });
  }
}
