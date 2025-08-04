import { Component } from '@angular/core';
import { SocialsComponent } from './socials/socials.component';
import { SitemapComponent } from './sitemap/sitemap.component';

@Component({
  selector: 'app-footer',
  imports: [SocialsComponent, SitemapComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
