import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelect } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { UnaVentaComponent } from "src/app/components/una-venta/una-venta.component";
import { Cliente } from "src/app/model/cliente.model";
import { LineaVenta } from "src/app/model/linea-venta.model";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.scss"],
})
export class VentasComponent implements OnInit, AfterViewInit {
  showFinalizarVenta: boolean = false;
  @ViewChildren("ventas") ventas: QueryList<UnaVentaComponent>;
  @ViewChild("efectivoValue", { static: true }) efectivoValue: ElementRef;
  @ViewChild("tarjetaValue", { static: true }) tarjetaValue: ElementRef;
  @ViewChild("clientesValue", { static: true }) clientesValue: MatSelect;
  clientes: Cliente[] = [];

  saving: boolean = false;

  ventasFinDisplayedColumns: string[] = [
    "localizador",
    "descripcion",
    "cantidad",
    "descuento",
    "total",
  ];
  ventasFinDataSource: MatTableDataSource<LineaVenta> =
    new MatTableDataSource<LineaVenta>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    public config: ConfigService,
    private dialog: DialogService,
    public vs: VentasService,
    public cs: ClientesService
  ) {}

  ngOnInit(): void {
    this.config.start().then((status) => {
      if (status === "install") {
        this.router.navigate(["/installation"]);
        return;
      }
      if (status === "loaded") {
        if (!this.config.isOpened) {
          this.router.navigate(["/"]);
          return;
        }
        if (this.vs.selected === -1) {
          this.newVenta();
          this.vs.ventaActual.mostrarEmpleados = this.config.empleados;
        } else {
          this.startFocus();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.ventasFinDataSource.sort = this.sort;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.showFinalizarVenta && !this.saving) {
        this.cerrarFinalizarVenta();
      }
    }
    if (ev.key === "+") {
      ev.preventDefault();
      this.endVenta();
    }
    if (ev.key === "Enter" && this.showFinalizarVenta) {
      this.finalizarVenta();
    }
  }

  newVenta(): void {
    this.vs.newVenta(
      this.config.empleados,
      this.config.idEmpleadoDef,
      this.config.colorEmpleadoDef,
      this.config.colorTextEmpleadoDef
    );
    if (!this.config.empleados) {
      this.startFocus();
    }
  }

  startFocus(): void {
    setTimeout(() => {
      this.ventas.get(this.vs.selected).setFocus();
    }, 0);
  }

  cerrarVenta(ind: number): void {
    if (this.vs.selected === ind) {
      this.vs.selected = 0;
    }
    this.vs.list.splice(ind, 1);
  }

  deleteVentaLinea(ind: number): void {
    this.vs.ventaActual.lineas.splice(ind, 1);
    this.vs.ventaActual.updateImporte();
    this.startFocus();
  }

  selectClient(id: number): void {
    this.startFocus();
  }

  endVenta(id: number = null): void {
    if (this.vs.ventaActual.lineas.length === 1) {
      return;
    }
    this.vs.loadFinVenta();
    this.cs.load();
    this.ventasFinDataSource.data = this.vs.fin.lineas;
    this.showFinalizarVenta = true;
    setTimeout(() => {
      this.efectivoValue.nativeElement.select();
    }, 0);
  }

  cerrarFinalizarVenta(): void {
    this.showFinalizarVenta = false;
    this.ventas.get(this.vs.selected).setFocus();
  }

  updateCambio(): void {
    const cambio: string = Utils.formatNumber(
      Utils.toNumber(this.vs.fin.efectivo) - Utils.toNumber(this.vs.fin.total)
    );
    if (Utils.toNumber(cambio) > 0) {
      this.vs.fin.cambio = cambio;
    }
  }

  updateEfectivoMixto(): void {
    if (Utils.toNumber(this.vs.fin.tarjeta) === 0) {
      this.vs.fin.efectivo = "0";
      this.vs.fin.cambio = "0";
      return;
    }
    const efectivo: string = Utils.formatNumber(
      Utils.toNumber(this.vs.fin.total) - Utils.toNumber(this.vs.fin.tarjeta)
    );
    if (Utils.toNumber(efectivo) > 0) {
      this.vs.fin.efectivo = efectivo;
      this.vs.fin.cambio = "0";
    } else {
      this.vs.fin.efectivo = "0";
      this.vs.fin.cambio = Utils.formatNumber(Utils.toNumber(efectivo) * -1);
    }
  }

  selectTipoPago(id: number): void {
    if (this.vs.fin.idTipoPago === id) {
      this.vs.fin.idTipoPago = null;
      this.vs.fin.efectivo = this.vs.fin.total;
      setTimeout(() => {
        this.efectivoValue.nativeElement.select();
      }, 0);
    } else {
      this.vs.fin.idTipoPago = id;
      if (this.vs.fin.pagoMixto) {
        this.updateEfectivoMixto();
        setTimeout(() => {
          this.tarjetaValue.nativeElement.select();
        }, 0);
      } else {
        this.vs.fin.efectivo = "0";
        this.vs.fin.cambio = "0";
      }
    }
  }

  changePagoMixto(ev: MatCheckboxChange): void {
    if (ev.checked) {
      setTimeout(() => {
        this.tarjetaValue.nativeElement.select();
      }, 0);
    } else {
      if (this.vs.fin.idTipoPago === null) {
        this.vs.fin.efectivo = "0";
        this.vs.fin.tarjeta = "0";
        setTimeout(() => {
          this.efectivoValue.nativeElement.select();
        }, 0);
      } else {
        this.vs.fin.tarjeta = "0";
      }
    }
  }

  changeFactura(ev: MatCheckboxChange): void {
    if (ev.checked) {
      this.clientes = [
        new Cliente(-1, "Elige un cliente"),
        ...this.cs.clientes,
      ];
      if (this.vs.fin.idCliente === -1) {
        setTimeout(() => {
          this.clientesValue.toggle();
        }, 0);
      }
    } else {
      this.vs.fin.idCliente = this.vs.cliente ? this.vs.cliente.id : null;
      if (this.vs.fin.pagoMixto) {
        setTimeout(() => {
          this.tarjetaValue.nativeElement.select();
        }, 0);
      } else {
        if (this.vs.fin.idTipoPago === null) {
          setTimeout(() => {
            this.efectivoValue.nativeElement.select();
          }, 0);
        }
      }
    }
  }

  finalizarVenta(): void {
    const tarjeta: number = Utils.toNumber(this.vs.fin.tarjeta);
    const efectivo: number = Utils.toNumber(this.vs.fin.efectivo);
    const total: number = Utils.toNumber(this.vs.fin.total);

    if (
      this.vs.fin.factura &&
      (this.vs.fin.idCliente === null || this.vs.fin.idCliente === -1)
    ) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has elegido ningún cliente!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.clientesValue.toggle();
          }, 0);
        });
      return;
    }
    if (this.vs.fin.pagoMixto) {
      if (this.vs.fin.idTipoPago === null) {
        this.dialog.alert({
          title: "Error",
          content:
            "¡Has indicado pago mixto pero no has elegido ningún tipo de pago!",
          ok: "Continuar",
        });
        return;
      } else {
        if (tarjeta + efectivo < total) {
          this.dialog
            .alert({
              title: "Error",
              content:
                "¡Las cantidades introducidas (tarjeta y efectivo) son inferiores al importe total!",
              ok: "Continuar",
            })
            .subscribe((result) => {
              setTimeout(() => {
                this.tarjetaValue.nativeElement.select();
              }, 0);
            });
          return;
        }
      }
    } else {
      if (this.vs.fin.idTipoPago === null && efectivo < total) {
        this.dialog
          .alert({
            title: "Error",
            content: "¡La cantidad introducida es inferior al importe total!",
            ok: "Continuar",
          })
          .subscribe((result) => {
            setTimeout(() => {
              this.efectivoValue.nativeElement.select();
            }, 0);
          });
        return;
      }
    }

    this.saving = true;
    this.vs.guardarVenta().subscribe((result) => {
      this.saving = false;
      this.vs.ventaActual.resetearVenta();
      this.vs.addLineaVenta();
      this.ventas
        .get(this.vs.selected)
        .loadUltimaVenta(result.importe, result.cambio);
      setTimeout(() => {
        this.cerrarFinalizarVenta();
      }, 0);
    });
  }
}
