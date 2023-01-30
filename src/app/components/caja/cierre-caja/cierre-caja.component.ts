import { Component } from "@angular/core";
import { Router } from "@angular/router";
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

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    public config: ConfigService,
    private dialog: DialogService,
    private router: Router
  ) {}

  load(): void {
    const date: string = Utils.getCurrentDate();
    this.as.getCierreCaja(date).subscribe((result) => {
      this.cierreCaja = this.cms.getCierreCaja(result.datos);
    });
  }

  cerrarCaja(): void {
    if (this.cierreCaja.real === null) {
      this.dialog
        .alert({
          title: "Error",
          content: 'El campo "Importe real" es obligatorio.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }

    if (this.cierreCaja.diferencia < 0) {
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
    this.as
      .saveCierreCaja(this.cierreCaja.toInterface())
      .subscribe((result) => {
        if (result.status === "ok") {
          this.config.isOpened = false;
          this.router.navigate(["/"]);
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "Ocurrió un error al realizar el cierre de caja.",
              ok: "Continuar",
            })
            .subscribe((result) => {});
        }
      });
  }
}
