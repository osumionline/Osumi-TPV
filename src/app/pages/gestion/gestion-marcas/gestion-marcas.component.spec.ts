import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMarcasComponent } from './gestion-marcas.component';

describe('GestionMarcasComponent', () => {
  let component: GestionMarcasComponent;
  let fixture: ComponentFixture<GestionMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
