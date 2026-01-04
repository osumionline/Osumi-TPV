import { Component, ElementRef, inject, OnInit, Signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';

@Component({
  selector: 'otpv-venta-descuento-modal',
  templateUrl: './venta-descuento-modal.component.html',
  styleUrls: ['./venta-descuento-modal.component.scss'],
  imports: [FormsModule, MatFormFieldModule, MatLabel, MatInput, MatButton],
})
export default class VentaDescuentoModalComponent implements OnInit {
  private readonly dialog: DialogService = inject(DialogService);
  private readonly customOverlayRef: CustomOverlayRef = inject(CustomOverlayRef);

  descuentoImporte: number | null = null;
  descuentoValue: Signal<ElementRef> = viewChild.required<ElementRef>('descuentoValue');

  ngOnInit(): void {
    setTimeout(() => {
      this.descuentoValue().nativeElement.focus();
    }, 0);
  }

  checkDescuentoImporte(ev: KeyboardEvent): void {
    if (ev.key == 'Enter') {
      this.selectDescuento();
    }
  }

  selectDescuento(): void {
    if (!this.descuentoImporte) {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No has introducido ningún descuento!',
        })
        .subscribe((): void => {
          setTimeout((): void => {
            this.descuentoValue().nativeElement.focus();
          }, 0);
        });
      return;
    }
    this.customOverlayRef.close(this.descuentoImporte);
  }
}
