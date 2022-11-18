import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DateValues } from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
import { HistoricoLineaVenta } from "src/app/model/historico-linea-venta.model";
import { HistoricoVenta } from "src/app/model/historico-venta.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
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
  historicoVentasSelectedDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "articulo",
    "unidades",
    "descuento",
    "importe",
  ];
  historicoVentasSelectedDataSource: MatTableDataSource<HistoricoLineaVenta> =
    new MatTableDataSource<HistoricoLineaVenta>();

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    public cs: ClientesService,
    public config: ConfigService,
    private dialog: DialogService
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
    this.historicoVentasSelected = new HistoricoVenta();
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
}
