import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsMapComponent } from './contact-us-map.component';

describe('ContactUsMapComponent', () => {
  let component: ContactUsMapComponent;
  let fixture: ComponentFixture<ContactUsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
