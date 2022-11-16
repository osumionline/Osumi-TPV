import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { DateValues } from "src/app/interfaces/interfaces";
import { HistoricoVenta } from "src/app/model/historico-venta.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-caja",
  templateUrl: "./caja.component.html",
  styleUrls: ["./caja.component.scss"],
})
export class CajaComponent implements OnInit, AfterViewInit {
  mostrarCaja: boolean = false;
  cajaSelectedTab: number = 0;
  @ViewChild("cajaTabs", { static: false })
  cajaTabs: MatTabGroup;

  historicoModo: string = "fecha";
  fecha: Date = new Date();
  rangoDesde: Date = new Date();
  rangoHasta: Date = new Date();

  historicoVentasList: HistoricoVenta[] = [];
  historicoVentasDisplayedColumns: string[] = [
    "fecha",
    "total",
    "nombreTipoPago",
  ];
  historicoVentasDataSource: MatTableDataSource<HistoricoVenta> =
    new MatTableDataSource<HistoricoVenta>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vs: VentasService, private cms: ClassMapperService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.historicoVentasDataSource.sort = this.sort;
  }

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
    this.changeFecha();
  }

  cerrarCaja(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.mostrarCaja = false;
  }

  getDate(date: Date): string {
    const day: string =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    const month: string =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1).toString();

    return day + "/" + month + "/" + date.getFullYear();
  }

  addDays(date: Date, number: number): Date {
    const newDate = new Date(date);
    return new Date(newDate.setDate(date.getDate() + number));
  }

  previousFecha(): void {
    this.fecha = this.addDays(this.fecha, -1);
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha = this.addDays(this.fecha, 1);
    this.changeFecha();
  }

  changeFecha(): void {
    const data: DateValues = {
      modo: "fecha",
      fecha: this.getDate(this.fecha),
      desde: null,
      hasta: null,
    };
    this.vs.getHistorico(data).subscribe((result) => {
      console.log(this.cms.getHistoricoVentas(result.list));
      this.historicoVentasList = this.cms.getHistoricoVentas(result.list);
      this.historicoVentasDataSource.data = this.historicoVentasList;
    });
  }
}
