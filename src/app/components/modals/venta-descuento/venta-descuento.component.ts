import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "otpv-venta-descuento",
  templateUrl: "./venta-descuento.component.html",
  styleUrls: ["./venta-descuento.component.scss"],
})
export class VentaDescuentoComponent implements OnInit {
  descuentoImporte: number = null;
  @ViewChild("descuentoValue", { static: true }) descuentoValue: ElementRef;

  constructor(
    private dialog: DialogService,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.descuentoValue.nativeElement.focus();
    }, 0);
  }

  checkDescuentoImporte(ev: KeyboardEvent): void {
    if (ev.key == "Enter") {
      this.selectDescuento();
    }
  }

  selectDescuento(): void {
    if (!this.descuentoImporte) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has introducido ningún descuento!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.descuentoValue.nativeElement.focus();
          }, 0);
        });
      return;
    }
    this.customOverlayRef.close(this.descuentoImporte);
  }
}
