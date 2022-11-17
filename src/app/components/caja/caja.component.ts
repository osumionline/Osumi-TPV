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
import { Cliente } from "src/app/model/cliente.model";
import { HistoricoVenta } from "src/app/model/historico-venta.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
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
  historicoVentasSelected: HistoricoVenta = new HistoricoVenta();

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    public cs: ClientesService,
    public config: ConfigService,
    private dialog: DialogService
  ) {}

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
    this.historicoVentasSelected = new HistoricoVenta();
    const data: DateValues = {
      modo: "fecha",
      fecha: this.getDate(this.fecha),
      desde: null,
      hasta: null,
    };
    this.buscarHistorico(data);
  }

  buscarPorRango(): void {
    if (this.rangoDesde.getTime() > this.rangoHasta.getTime()) {
      this.dialog
        .alert({
          title: "Error",
          content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }
    const data: DateValues = {
      modo: "rango",
      fecha: null,
      desde: this.getDate(this.rangoDesde),
      hasta: this.getDate(this.rangoHasta),
    };
    this.buscarHistorico(data);
  }

  buscarHistorico(data: DateValues): void {
    this.vs.getHistorico(data).subscribe((result) => {
      this.historicoVentasList = this.cms.getHistoricoVentas(result.list);
      this.historicoVentasDataSource.data = this.historicoVentasList;
    });
  }

  selectVenta(ind: number): void {
    this.historicoVentasSelected = this.historicoVentasList[ind];
  }

  changeCliente(): void {
    this.cs
      .asignarCliente(
        this.historicoVentasSelected.id,
        this.historicoVentasSelected.idCliente
      )
      .subscribe((result) => {
        if (result.status == "ok") {
          const cliente: Cliente = this.cs.clientes.find(
            (x: Cliente): boolean =>
              x.id === this.historicoVentasSelected.idCliente
          );
          this.historicoVentasSelected.cliente = cliente.nombreApellidos;
        }
      });
  }

  changeFormaPago(): void {
    this.vs
      .asignarTipoPago(
        this.historicoVentasSelected.id,
        this.historicoVentasSelected.idTipoPago
      )
      .subscribe((result) => {
        if (result.status == "ok") {
          if (this.historicoVentasSelected.idTipoPago !== null) {
            const tp: TipoPago = this.config.tiposPago.find(
              (x: TipoPago): boolean =>
                x.id === this.historicoVentasSelected.idTipoPago
            );
            this.historicoVentasSelected.nombreTipoPago = tp.nombre;
          } else {
            this.historicoVentasSelected.nombreTipoPago = "Efectivo";
          }
        }
      });
  }
}
