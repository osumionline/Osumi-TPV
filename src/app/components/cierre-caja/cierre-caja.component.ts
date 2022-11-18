import { Component } from "@angular/core";
import { CierreCaja } from "src/app/model/cierre-caja.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
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

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    public config: ConfigService
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
}
