import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-venta-varios-modal",
  templateUrl: "./venta-varios-modal.component.html",
  styleUrls: ["./venta-varios-modal.component.scss"],
})
export class VentaVariosModalComponent implements OnInit {
  tipoIva: string = "iva";
  ivaOptions: IVAOption[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  formVarios: FormGroup = new FormGroup({
    nombre: new FormControl(null, Validators.required),
    pvp: new FormControl(null),
  });
  @ViewChild("variosPVPbox", { static: true }) variosPVPbox: ElementRef;

  constructor(
    private config: ConfigService,
    private customOverlayRef: CustomOverlayRef<
      null,
      { nombre: string; pvp: number; iva: number; re: number }
    >
  ) {}

  ngOnInit(): void {
    this.tipoIva = this.config.tipoIva;
    this.ivaOptions = this.config.ivaOptions;
    this.selectedIvaOption = new IVAOption(
      this.tipoIva,
      21,
      this.tipoIva === "re" ? 5.2 : -1
    );
    this.formVarios.get("nombre").setValue(this.customOverlayRef.data.nombre);
    this.formVarios.get("pvp").setValue(this.customOverlayRef.data.pvp);
    this.selectedIvaOption.updateValues(
      this.customOverlayRef.data.iva,
      this.customOverlayRef.data.re
    );
    setTimeout(() => {
      this.variosPVPbox.nativeElement.focus();
    }, 0);
  }

  updateIvaRe(ev: string): void {
    const ivaInd: number = this.config.ivaOptions.findIndex(
      (x: IVAOption): boolean => x.id == ev
    );
    this.selectedIvaOption.updateValues(
      this.config.ivaOptions[ivaInd].iva,
      this.config.ivaOptions[ivaInd].re
    );
  }

  actualizarVarios(): void {
    this.customOverlayRef.close({
      nombre: this.formVarios.get("nombre").value,
      pvp: this.formVarios.get("pvp").value,
      iva: this.selectedIvaOption.iva,
      re: this.selectedIvaOption.re !== -1 ? this.selectedIvaOption.re : null,
    });
  }
}
