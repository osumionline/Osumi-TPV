import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { CustomOverlayRef } from "@model/tpv/custom-overlay-ref.model";
import { DialogService } from "@services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-venta-descuento-modal",
  templateUrl: "./venta-descuento-modal.component.html",
  styleUrls: ["./venta-descuento-modal.component.scss"],
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton],
})
export class VentaDescuentoModalComponent implements OnInit {
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
        .subscribe((): void => {
          setTimeout((): void => {
            this.descuentoValue.nativeElement.focus();
          }, 0);
        });
      return;
    }
    this.customOverlayRef.close(this.descuentoImporte);
  }
}
