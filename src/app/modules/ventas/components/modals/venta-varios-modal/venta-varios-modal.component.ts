import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { IVAOption } from "src/app/model/tpv/iva-option.model";
import { ConfigService } from "src/app/services/config.service";

@Component({
  standalone: true,
  selector: "otpv-venta-varios-modal",
  templateUrl: "./venta-varios-modal.component.html",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class VentaVariosModalComponent implements OnInit {
  ivaList: number[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  formVarios: FormGroup = new FormGroup({
    nombre: new FormControl<string>(null, Validators.required),
    pvp: new FormControl<number>(null, Validators.required),
    iva: new FormControl<number>(21, Validators.required),
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
    for (const ivaOption of this.config.ivaOptions) {
      this.ivaList.push(ivaOption.iva);
    }
    this.formVarios.get("nombre").setValue(this.customOverlayRef.data.nombre);
    this.formVarios.get("pvp").setValue(this.customOverlayRef.data.pvp);
    this.formVarios.get("iva").setValue(this.customOverlayRef.data.iva);
    setTimeout((): void => {
      this.variosPVPbox.nativeElement.focus();
    }, 0);
  }

  actualizarVarios(): void {
    this.customOverlayRef.close({
      nombre: this.formVarios.get("nombre").value,
      pvp: this.formVarios.get("pvp").value,
      iva: this.formVarios.get("iva").value,
    });
  }
}
