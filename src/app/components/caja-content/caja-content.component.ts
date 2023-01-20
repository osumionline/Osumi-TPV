import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { CierreCajaComponent } from "src/app/components/cierre-caja/cierre-caja.component";
import { HistoricoVentasComponent } from "src/app/components/historico-ventas/historico-ventas.component";
import { SalidasCajaComponent } from "src/app/components/salidas-caja/salidas-caja.component";
import { Month } from "src/app/interfaces/interfaces";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-caja-content",
  templateUrl: "./caja-content.component.html",
  styleUrls: ["./caja-content.component.scss"],
})
export class CajaContentComponent implements OnInit {
  @Output() cerrarVentanaEvent: EventEmitter<number> =
    new EventEmitter<number>();
  @Input() from: string = "modal";
  cajaSelectedTab: number = 0;
  @ViewChild("cajaTabs", { static: false })
  cajaTabs: MatTabGroup;

  @ViewChild("historicoVentas", { static: true })
  historicoVentas: HistoricoVentasComponent;
  @ViewChild("salidasCaja", { static: true })
  salidasCaja: SalidasCajaComponent;
  @ViewChild("cierreCaja", { static: true })
  cierreCaja: CierreCajaComponent;

  informeTipo: string = null;
  monthList: Month[] = [];
  informeMonth: number = null;
  yearList: number[] = [];
  informeYear: number = null;

  constructor(private config: ConfigService) {}

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const d: Date = new Date();
    for (let y: number = d.getFullYear(); y > d.getFullYear() - 5; y--) {
      this.yearList.push(y);
    }
    this.historicoVentas.changeFecha();
    this.salidasCaja.changeFecha();
    if (this.from === "tab") {
      this.cierreCaja.load();
    }
  }

  selectTab(option: string): void {
    if (option === "historico") {
      this.cajaSelectedTab = 0;
    }
    if (option === "salidas") {
      this.cajaSelectedTab = 1;
    }
    this.cajaTabs.realignInkBar();
  }

  checkCajaTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2 && this.from === "tab") {
      this.cierreCaja.load();
    }
  }

  cerrarCaja(): void {
    this.cerrarVentanaEvent.emit(0);
  }

  generarInforme(): void {
    if (this.informeTipo === "cierre-mensual") {
      window.open(
        `informes/cierre-mensual/${this.informeYear}/${this.informeMonth}`
      );
    }
    if (this.informeTipo === "informe-mensual") {
      window.open(
        `informes/informe-mensual/${this.informeYear}/${this.informeMonth}`
      );
    }
  }
}
