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
import { VentaHistoricoOtrosInterface } from "src/app/interfaces/caja.interface";
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

  totalDia: number = 0;
  ventasEfectivo: number = 0;
  ventasOtros: VentaHistoricoOtrosInterface[] = [];
  ventasWeb: number = 0;
  ventasBeneficio: number = 0;

  historicoVentasSelected: VentaHistorico = new VentaHistorico();
  historicoVentasSelectedDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "articulo",
    "unidades",
    "pvp",
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
      id: null,
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
      id: null,
      desde: Utils.getDate(this.rangoDesde),
      hasta: Utils.getDate(this.rangoHasta),
    };
    this.buscarHistorico(data);
  }

  buscarHistorico(data: DateValues): void {
    this.vs.getHistorico(data).subscribe((result) => {
      this.historicoVentasList = this.cms.getHistoricoVentas(result.list);
      this.historicoVentasDataSource.data = this.historicoVentasList;

      this.totalDia = result.totalDia;
      this.ventasEfectivo = result.ventasEfectivo;
      this.ventasOtros = result.ventasOtros;
      this.ventasWeb = result.ventasWeb;
      this.ventasBeneficio = result.ventasBeneficio;
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

  enviarEmail(): void {
    if (this.historicoVentasSelected.idCliente === null) {
      this.dialog
        .confirm({
          title: "Cliente",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o introducir uno manualmente?",
          ok: "Elegir cliente",
          cancel: "Introducir email",
        })
        .subscribe((result) => {
          if (result === true) {
            setTimeout(() => {
              this.clientesBox.toggle();
            }, 0);
          } else {
            this.pedirEmail();
          }
        });
    } else {
      const cliente: Cliente = this.cs.findById(
        this.historicoVentasSelected.idCliente
      );
      if (cliente.email === null) {
        this.dialog
          .confirm({
            title: "Enviar email",
            content:
              "El cliente seleccionado no tiene una dirección de email asignada, ¿quieres ir a su ficha o introducir uno manualmente?",
            ok: "Ir a su ficha",
            cancel: "Introducir email",
          })
          .subscribe((result) => {
            if (result === true) {
              this.router.navigate(["/clientes/" + cliente.id]);
            } else {
              this.pedirEmail();
            }
          });
      } else {
        this.sendTicket(this.historicoVentasSelected.id, cliente.email);
      }
    }
  }

  pedirEmail(): void {
    this.dialog
      .form({
        title: "Introducir email",
        content: "Introduce el email del cliente",
        ok: "Continuar",
        cancel: "Cancelar",
        fields: [{ title: "Email", type: "email", value: null }],
      })
      .subscribe((result) => {
        if (result !== undefined) {
          this.sendTicket(this.historicoVentasSelected.id, result[0].value);
        }
      });
  }

  sendTicket(id: number, email: string): void {
    this.dialog
      .confirm({
        title: "Enviar email",
        content:
          'Se enviará el ticket al email "' + email + '", ¿quieres continuar?',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.sendTicketConfirm(id, email);
        }
      });
  }

  sendTicketConfirm(id: number, email: string): void {
    this.vs.sendTicket(id, Utils.urlencode(email)).subscribe((result) => {
      console.log(result);
      if (result.status === "ok") {
        this.dialog
          .alert({
            title: "Enviado",
            content:
              'El ticket de la venta ha sido correctamente enviado a la dirección "' +
              email +
              '"',
            ok: "Continuar",
          })
          .subscribe((result) => {});
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              'El ticket de la venta no ha podido ser enviado a la dirección "' +
              email +
              '", ¿tal vez la dirección no es correcta?',
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }
}
