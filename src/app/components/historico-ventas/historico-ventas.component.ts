import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DateValues } from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
import { VentaHistorico } from "src/app/model/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/venta-linea-historico.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-historico-ventas",
  templateUrl: "./historico-ventas.component.html",
  styleUrls: ["./historico-ventas.component.scss"],
})
export class HistoricoVentasComponent implements AfterViewInit {
  @Output() cerrarVentanaEvent: EventEmitter<number> =
    new EventEmitter<number>();
  historicoModo: string = "fecha";
  fecha: Date = new Date();
  rangoDesde: Date = new Date();
  rangoHasta: Date = new Date();

  historicoVentasList: VentaHistorico[] = [];
  historicoVentasDisplayedColumns: string[] = [
    "fecha",
    "total",
    "nombreTipoPago",
  ];
  historicoVentasDataSource: MatTableDataSource<VentaHistorico> =
    new MatTableDataSource<VentaHistorico>();
  @ViewChild(MatSort) sort: MatSort;

  historicoVentasSelected: VentaHistorico = new VentaHistorico();
  historicoVentasSelectedDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "articulo",
    "unidades",
    "descuento",
    "importe",
  ];
  historicoVentasSelectedDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();

  @ViewChild("clientesBox", { static: true }) clientesBox: MatSelect;

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    public cs: ClientesService,
    public config: ConfigService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.historicoVentasDataSource.sort = this.sort;
    this.historicoVentasSelectedDataSource.sort = this.sort;
  }

  previousFecha(): void {
    this.fecha = Utils.addDays(this.fecha, -1);
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha = Utils.addDays(this.fecha, 1);
    this.changeFecha();
  }

  changeFecha(): void {
    this.historicoVentasSelected = new VentaHistorico();
    const data: DateValues = {
      modo: "fecha",
      fecha: Utils.getDate(this.fecha),
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
      desde: Utils.getDate(this.rangoDesde),
      hasta: Utils.getDate(this.rangoHasta),
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
    this.historicoVentasSelectedDataSource.data =
      this.historicoVentasSelected.lineas;
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

  generarFactura(): void {
    if (this.historicoVentasSelected.idCliente === null) {
      this.dialog
        .confirm({
          title: "Cliente",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o crear uno nuevo?",
          ok: "Crear nuevo",
          cancel: "Elegir cliente",
        })
        .subscribe((result) => {
          if (result === true) {
            this.cerrarVentanaEvent.emit(0);
            this.router.navigate(["/clientes/new"]);
          } else {
            setTimeout(() => {
              this.clientesBox.toggle();
            }, 0);
          }
        });
    } else {
      window.open("/factura/venta/" + this.historicoVentasSelected.id);
    }
  }
}
