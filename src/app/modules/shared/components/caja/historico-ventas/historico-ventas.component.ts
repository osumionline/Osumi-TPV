import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { addDays, getDate, urlencode } from "@osumi/tools";
import {
  HistoricoVentasResult,
  VentaHistoricoOtrosInterface,
} from "src/app/interfaces/caja.interface";
import {
  DateValues,
  DialogOptions,
  IdSaveResult,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { VentaHistorico } from "src/app/model/caja/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/caja/venta-linea-historico.model";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { TipoPago } from "src/app/model/tpv/tipo-pago.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-historico-ventas",
  templateUrl: "./historico-ventas.component.html",
  styleUrls: ["./historico-ventas.component.scss"],
  imports: [
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
  ],
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
    this.fecha = addDays(this.fecha, -1);
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha = addDays(this.fecha, 1);
    this.changeFecha();
  }

  changeFecha(): void {
    this.historicoVentasSelected = new VentaHistorico();
    const data: DateValues = {
      modo: "fecha",
      id: null,
      fecha: getDate(this.fecha),
      desde: null,
      hasta: null,
    };
    this.buscarHistorico(data);
  }

  buscarPorRango(): void {
    if (this.rangoDesde.getTime() > this.rangoHasta.getTime()) {
      this.dialog.alert({
        title: "Error",
        content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
        ok: "Continuar",
      });
      return;
    }
    const data: DateValues = {
      modo: "rango",
      fecha: null,
      id: null,
      desde: getDate(this.rangoDesde),
      hasta: getDate(this.rangoHasta),
    };
    this.buscarHistorico(data);
  }

  buscarHistorico(data: DateValues): void {
    this.vs
      .getHistorico(data)
      .subscribe((result: HistoricoVentasResult): void => {
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
      .subscribe((result: StatusResult): void => {
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
      .subscribe((result: StatusResult): void => {
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

  printTicket(tipo: string): void {
    this.vs
      .printTicket(this.historicoVentasSelected.id, tipo)
      .subscribe((result: StatusResult): void => {
        if (result.status === "error") {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al imprimir el ticket.",
            ok: "Continuar",
          });
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
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.cerrarVentanaEvent.emit(0);
            this.router.navigate(["/clientes/new"]);
          } else {
            setTimeout((): void => {
              this.clientesBox.toggle();
            }, 0);
          }
        });
    } else {
      this.confirmFactura();
    }
  }

  confirmFactura(): void {
    const selectedClient: Cliente = this.cs.findById(
      this.historicoVentasSelected.idCliente
    );

    if (selectedClient.dniCif === null || selectedClient.dniCif === "") {
      this.dialog.alert({
        title: "Error",
        content:
          'El cliente "' +
          selectedClient.nombreApellidos +
          '" no tiene DNI/CIF introducido por lo que no se le puede crear una factura.',
        ok: "Continuar",
      });
    } else {
      if (
        selectedClient.direccion === null ||
        selectedClient.direccion === "" ||
        selectedClient.codigoPostal === null ||
        selectedClient.codigoPostal === "" ||
        selectedClient.poblacion === null ||
        selectedClient.poblacion === "" ||
        selectedClient.provincia === null
      ) {
        this.dialog
          .confirm({
            title: "Confirmar",
            content:
              'El cliente "' +
              selectedClient.nombreApellidos +
              '" no tiene dirección introducida. ¿Quieres continuar?',
            ok: "Continuar",
            cancel: "Cancelar",
          })
          .subscribe((result: boolean): void => {
            if (result === true) {
              this.saveFacturaFromVenta();
            }
          });
      } else {
        this.saveFacturaFromVenta();
      }
    }
  }

  saveFacturaFromVenta(): void {
    this.cs
      .saveFacturaFromVenta(this.historicoVentasSelected.id)
      .subscribe((result: IdSaveResult): void => {
        if (result.status === "ok" || result.status === "error-factura") {
          window.open("/clientes/factura/" + result.id + "/preview");
        }
        if (result.status === "error-facturada") {
          window.open("/clientes/factura/" + result.id);
        }
      });
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
        .subscribe((result: boolean): void => {
          if (result === true) {
            setTimeout((): void => {
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
      if (cliente.email === null || cliente.email === "") {
        this.dialog
          .confirm({
            title: "Enviar email",
            content:
              "El cliente seleccionado no tiene una dirección de email asignada, ¿quieres ir a su ficha o introducir uno manualmente?",
            ok: "Ir a su ficha",
            cancel: "Introducir email",
          })
          .subscribe((result: boolean): void => {
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
      .subscribe((result: DialogOptions): void => {
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
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.sendTicketConfirm(id, email);
        }
      });
  }

  sendTicketConfirm(id: number, email: string): void {
    this.vs
      .sendTicket(id, urlencode(email))
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.dialog.alert({
            title: "Enviado",
            content:
              'El ticket de la venta ha sido correctamente enviado a la dirección "' +
              email +
              '"',
            ok: "Continuar",
          });
        } else {
          this.dialog.alert({
            title: "Error",
            content:
              'El ticket de la venta no ha podido ser enviado a la dirección "' +
              email +
              '", ¿tal vez la dirección no es correcta?',
            ok: "Continuar",
          });
        }
      });
  }

  devolucion(): void {
    this.cerrarVentanaEvent.emit(0);
    this.router.navigate(["/ventas/" + this.historicoVentasSelected.id]);
  }
}
