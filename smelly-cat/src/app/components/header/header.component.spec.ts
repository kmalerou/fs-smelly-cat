import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleBurgerMenu event when openBurgerMenu is called', () => {
    spyOn(component.toggleBurgerMenu, 'emit');
    component.openBurgerMenu();
    expect(component.toggleBurgerMenu.emit).toHaveBeenCalled();
  });

  it('should call openBurgerMenu when burger menu button is clicked', () => {
    spyOn(component, 'openBurgerMenu');
    const button = fixture.debugElement.query(By.css('.header__burger-button'));
    button.nativeElement.click();
    expect(component.openBurgerMenu).toHaveBeenCalled();
  });
});
