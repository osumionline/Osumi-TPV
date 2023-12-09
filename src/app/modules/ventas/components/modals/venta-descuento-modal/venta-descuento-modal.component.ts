import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-venta-descuento-modal",
  templateUrl: "./venta-descuento-modal.component.html",
  styleUrls: ["./venta-descuento-modal.component.scss"],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
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
