import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBar,
          useValue: snackBarSpy,
        },
      ],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#openDefaultSnackbar should call MatSnackBar.open with default values', () => {
    const message = 'Test message';
    const action = 'Close';
    const snackDefaultConfig = {
      duration: 3000,
      horizontalPosition: 'right' as MatSnackBarHorizontalPosition,
      verticalPosition: 'top' as MatSnackBarVerticalPosition,
    };
    service.openDefaultSnackbar(message);

    expect(snackBarSpy.open)
      .withContext('MatSnackBar.open should be called with defaults')
      .toHaveBeenCalledWith(message, action, snackDefaultConfig);

    expect(snackBarSpy.open.calls.count())
      .withContext('MatSnackBar.open should be called once')
      .toBe(1);
  });
});
