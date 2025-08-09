import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MatSidenavModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav when HeaderComponent emits toggleBurgerMenu', () => {
    const sidenavDE = fixture.debugElement.query(By.directive(MatSidenav));
    const sidenav = sidenavDE.componentInstance as MatSidenav;
    spyOn(sidenav, 'toggle');

    const headerDE = fixture.debugElement.query(By.directive(HeaderComponent));
    const headerComponent = headerDE.componentInstance as HeaderComponent;
    headerComponent.toggleBurgerMenu.emit();

    fixture.detectChanges();

    expect(sidenav.toggle).toHaveBeenCalled();
  });
});
