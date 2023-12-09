import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { getCurrentDate } from "@osumi/tools";
import { CierreCajaResult } from "src/app/interfaces/caja.interface";
import { StatusResult } from "src/app/interfaces/interfaces";
import { CierreCaja } from "src/app/model/caja/cierre-caja.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-cierre-caja",
  templateUrl: "./cierre-caja.component.html",
  styleUrls: ["./cierre-caja.component.scss"],
  imports: [
    FormsModule,
    FixedNumberPipe,
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CierreCajaComponent {
  cierreCaja: CierreCaja = new CierreCaja();
  showCoins: boolean = false;

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    public config: ConfigService,
    private dialog: DialogService,
    private router: Router
  ) {}

  load(): void {
    const date: string = getCurrentDate();
    this.as.getCierreCaja(date).subscribe((result: CierreCajaResult): void => {
      this.cierreCaja = this.cms.getCierreCaja(result.datos);
    });
  }

  openCoins(): void {
    this.showCoins = !this.showCoins;
  }

  updateImporteReal(): void {
    this.cierreCaja.real =
      this.cierreCaja.importe1c * 0.01 +
      this.cierreCaja.importe2c * 0.02 +
      this.cierreCaja.importe5c * 0.05 +
      this.cierreCaja.importe10c * 0.1 +
      this.cierreCaja.importe20c * 0.2 +
      this.cierreCaja.importe50c * 0.5 +
      this.cierreCaja.importe1 +
      this.cierreCaja.importe2 * 2 +
      this.cierreCaja.importe5 * 5 +
      this.cierreCaja.importe10 * 10 +
      this.cierreCaja.importe20 * 20 +
      this.cierreCaja.importe50 * 50 +
      this.cierreCaja.importe100 * 100 +
      this.cierreCaja.importe200 * 200 +
      this.cierreCaja.importe500 * 500;
  }

  cerrarCaja(): void {
    if (this.cierreCaja.real === null) {
      this.dialog.alert({
        title: "Error",
        content: 'El campo "Importe real" es obligatorio.',
        ok: "Continuar",
      });
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
        .subscribe((result: boolean): void => {
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
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.config.isOpened = false;
          this.router.navigate(["/"]);
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al realizar el cierre de caja.",
            ok: "Continuar",
          });
        }
      });
  }
}
