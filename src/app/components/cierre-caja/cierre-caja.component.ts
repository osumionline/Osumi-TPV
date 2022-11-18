import { Component, ElementRef, ViewChild } from "@angular/core";
import { CierreCaja } from "src/app/model/cierre-caja.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-cierre-caja",
  templateUrl: "./cierre-caja.component.html",
  styleUrls: ["./cierre-caja.component.scss"],
})
export class CierreCajaComponent {
  cierreCaja: CierreCaja = new CierreCaja();
  importeReal: number = null;
  diferencia: number = null;

  @ViewChild("importeRealBox", { static: true }) importeRealBox: ElementRef;

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    public config: ConfigService,
    private dialog: DialogService
  ) {}

  load(): void {
    const date: string = Utils.getCurrentDate();
    this.as.getCierreCaja(date).subscribe((result) => {
      this.cierreCaja = this.cms.getCierreCaja(result.datos);
    });
  }

  calculaDiferencia(): void {
    if (this.importeReal === null) {
      this.diferencia = 0;
      return;
    }
    this.diferencia = -1 * (this.cierreCaja.importeTotal - this.importeReal);
  }

  cerrarCaja(): void {
    if (this.importeReal === null) {
      this.dialog
        .alert({
          title: "Error",
          content: 'El campo "Importe real" es obligatorio.',
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.importeRealBox.nativeElement.focus();
          }, 0);
        });
      return;
    }

    if (this.diferencia < 0) {
      this.dialog
        .confirm({
          title: "Confirmar",
          content:
            "Atención, la diferencia de caja es negativa. ¿Estás seguro de querer continuar?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.confirmCerrarCaja();
          }
        });
    } else {
      this.confirmCerrarCaja();
    }
  }

  confirmCerrarCaja(): void {
    console.log("confirmCerrarCaja");
  }
}
