import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { CierreCajaComponent } from "src/app/components/cierre-caja/cierre-caja.component";
import { HistoricoVentasComponent } from "src/app/components/historico-ventas/historico-ventas.component";
import { SalidasCajaComponent } from "src/app/components/salidas-caja/salidas-caja.component";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";

@Component({
  selector: "otpv-caja-modal",
  templateUrl: "./caja-modal.component.html",
  styleUrls: ["./caja-modal.component.scss"],
})
export class CajaModalComponent implements OnInit {
  cajaSelectedTab: number = 0;
  @ViewChild("cajaTabs", { static: false })
  cajaTabs: MatTabGroup;

  @ViewChild("historicoVentas", { static: true })
  historicoVentas: HistoricoVentasComponent;
  @ViewChild("salidasCaja", { static: true })
  salidasCaja: SalidasCajaComponent;
  @ViewChild("cierreCaja", { static: true })
  cierreCaja: CierreCajaComponent;

  constructor(
    private customOverlayRef: CustomOverlayRef<null, { option: string }>
  ) {}

  ngOnInit(): void {}

  abrirCaja(): void {
    if (this.customOverlayRef.data.option === "historico") {
      this.cajaSelectedTab = 0;
    }
    if (this.customOverlayRef.data.option === "salidas") {
      this.cajaSelectedTab = 1;
    }
    this.cajaTabs.realignInkBar();
    this.historicoVentas.changeFecha();
    this.salidasCaja.changeFecha();
    this.cierreCaja.load();
  }

  checkCajaTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2) {
      this.cierreCaja.load();
    }
  }

  cerrarCaja(): void {
    this.customOverlayRef.close();
  }
}
