import { Component, HostListener, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { HistoricoVentasComponent } from "src/app/components/historico-ventas/historico-ventas.component";

@Component({
  selector: "otpv-caja",
  templateUrl: "./caja.component.html",
  styleUrls: ["./caja.component.scss"],
})
export class CajaComponent {
  mostrarCaja: boolean = false;
  cajaSelectedTab: number = 0;
  @ViewChild("cajaTabs", { static: false })
  cajaTabs: MatTabGroup;

  @ViewChild("historicoVentas", { static: true })
  historicoVentas: HistoricoVentasComponent;

  constructor() {}

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.mostrarCaja) {
        this.cerrarCaja();
      }
    }
  }

  abrirCaja(modo: string): void {
    this.mostrarCaja = true;
    if (modo === "historico") {
      this.cajaSelectedTab = 0;
    }
    if (modo === "salidas") {
      this.cajaSelectedTab = 1;
    }
    this.cajaTabs.realignInkBar();
    this.historicoVentas.changeFecha();
  }

  cerrarCaja(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.mostrarCaja = false;
  }
}
