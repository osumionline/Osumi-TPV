import { Component, Signal, viewChild } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import AlmacenInventarioComponent from '@modules/almacen/components/almacen-inventario/almacen-inventario.component';
import CaducidadesComponent from '@modules/almacen/components/caducidades/caducidades.component';
import ImprentaComponent from '@modules/almacen/components/imprenta/imprenta.component';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.scss'],
  imports: [
    ImprentaComponent,
    AlmacenInventarioComponent,
    CaducidadesComponent,
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
  ],
})
export default class AlmacenComponent {
  imprenta: Signal<ImprentaComponent | undefined> = viewChild('imprenta');

  tabChange(ev: MatTabChangeEvent): void {
    if (ev.index === 1) {
      this.imprenta()?.searchFocus();
    }
  }
}
