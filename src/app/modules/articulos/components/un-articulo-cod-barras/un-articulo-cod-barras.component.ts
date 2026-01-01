import { Component, ElementRef, ModelSignal, Signal, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import Articulo from '@model/articulos/articulo.model';
import CodigoBarras from '@model/articulos/codigo-barras.model';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'otpv-un-articulo-cod-barras',
  imports: [QRCodeComponent, MatIconButton, MatButton, MatIcon, FormsModule],
  templateUrl: './un-articulo-cod-barras.component.html',
  styleUrls: [
    './un-articulo-cod-barras.component.scss',
    '../un-articulo/un-articulo.component.scss',
  ],
})
export default class UnArticuloCodBarrasComponent {
  articulo: ModelSignal<Articulo> = model.required<Articulo>();
  newCodBarras: string | null = null;
  codigoBarrasBox: Signal<ElementRef> = viewChild.required<ElementRef>('codigoBarrasBox');

  focus(): void {
    this.codigoBarrasBox().nativeElement.focus();
  }

  preventCodBarras(ev: KeyboardEvent): void {
    if (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
      }
    }
  }

  fixCodBarras(ev: KeyboardEvent | null = null): void {
    if (ev) {
      if (ev.key === 'Enter') {
        this.addNewCodBarras();
      }
    } else {
      this.addNewCodBarras();
    }
  }

  addNewCodBarras(): void {
    if (this.newCodBarras) {
      const cb: CodigoBarras = new CodigoBarras(null, this.newCodBarras, false);

      this.articulo.update((value: Articulo): Articulo => {
        value.codigosBarras.push(cb);
        return value;
      });
      this.newCodBarras = null;
    }
  }

  deleteCodBarras(codBarras: CodigoBarras): void {
    const ind: number = this.articulo().codigosBarras.findIndex(
      (x: CodigoBarras): boolean => x.codigoBarras == codBarras.codigoBarras
    );
    this.articulo.update((value: Articulo): Articulo => {
      value.codigosBarras.splice(ind, 1);
      return value;
    });
  }
}
