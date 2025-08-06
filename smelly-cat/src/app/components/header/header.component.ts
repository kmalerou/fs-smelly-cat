import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [NavigationBarComponent, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleBurgerMenu = new EventEmitter<void>();

  public openBurgerMenu(): void {
    this.toggleBurgerMenu.emit();
  }
}
