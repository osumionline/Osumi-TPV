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
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { HeaderComponent } from "src/app/components/header/header.component";
import { TabsComponent } from "src/app/components/tabs/tabs.component";
import { UnaVentaComponent } from "src/app/components/una-venta/una-venta.component";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { Cliente } from "src/app/model/cliente.model";
import { VentaLinea } from "src/app/model/venta-linea.model";
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
  @ViewChild("tabs", { static: true }) tabs: TabsComponent;
  @ViewChildren("ventas") ventas: QueryList<UnaVentaComponent>;
  @ViewChild("efectivoValue", { static: true }) efectivoValue: ElementRef;
  @ViewChild("tarjetaValue", { static: true }) tarjetaValue: ElementRef;
  clientes: Cliente[] = [];

  saving: boolean = false;

  ventasFinDisplayedColumns: string[] = [
    "localizador",
    "descripcion",
    "cantidad",
    "descuento",
    "total",
  ];
  ventasFinDataSource: MatTableDataSource<VentaLinea> =
    new MatTableDataSource<VentaLinea>();
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("header", { static: true }) header: HeaderComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
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
        this.startVentas();
      }
    });
  }

  startVentas(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id && parseInt(params.id) !== 0) {
        this.newVenta(-1 * parseInt(params.id));
        this.vs.ventaActual.mostrarEmpleados = this.config.empleados;
      } else {
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

  newVenta(id: number = null): void {
    this.vs.newVenta(
      this.config.empleados,
      this.config.idEmpleadoDef,
      this.config.colorEmpleadoDef,
      this.config.colorTextEmpleadoDef,
      id
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

  selectClient(cliente: SelectClienteInterface): void {
    if (cliente === null || cliente.from === null) {
      this.startFocus();
    } else {
      this.abreFinalizarVenta();
    }
  }

  endVenta(id: number = null): void {
    if (this.vs.ventaActual.lineas.length === 1) {
      return;
    }
    this.vs.loadFinVenta();
    this.cs.load();
    this.ventasFinDataSource.data = this.vs.fin.lineas;
    this.abreFinalizarVenta();
  }

  abreFinalizarVenta(): void {
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
    let cambio: string = "";
    if (!this.vs.fin.pagoMixto) {
      cambio = Utils.formatNumber(
        Utils.toNumber(this.vs.fin.efectivo) - Utils.toNumber(this.vs.fin.total)
      );
    } else {
      cambio = Utils.formatNumber(
        Utils.toNumber(this.vs.fin.efectivo) +
          Utils.toNumber(this.vs.fin.tarjeta) -
          Utils.toNumber(this.vs.fin.total)
      );
    }
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

  checkTicket(): void {
    // Se ha elegido email y no tiene cliente asignado
    if (this.vs.fin.imprimir === "email" && this.vs.fin.idCliente === -1) {
      this.dialog
        .confirm({
          title: "Enviar email",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o introducir uno manualmente?",
          ok: "Elegir cliente",
          cancel: "Introducir email",
        })
        .subscribe((result) => {
          if (result === true) {
            this.cerrarFinalizarVenta();
            this.tabs.selectClient("venta");
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido email, tiene cliente asignado pero no tiene email
    if (
      this.vs.fin.imprimir === "email" &&
      this.vs.fin.idCliente !== -1 &&
      (this.vs.cliente.email === null || this.vs.cliente.email === "")
    ) {
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
            this.router.navigate(["/clientes/" + this.vs.cliente.id]);
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido factura y no tiene cliente asignado
    if (this.vs.fin.imprimir === "factura" && this.vs.fin.idCliente === -1) {
      this.dialog
        .confirm({
          title: "Imprimir factura",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.cerrarFinalizarVenta();
            this.tabs.selectClient("factura");
          } else {
            this.vs.fin.imprimir = "si";
          }
        });
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
        if (result === undefined) {
          this.vs.fin.imprimir = "si";
        } else {
          this.vs.fin.email = result[0].value;
        }
      });
  }

  finalizarVenta(): void {
    const tarjeta: number = Utils.toNumber(this.vs.fin.tarjeta);
    const efectivo: number = Utils.toNumber(this.vs.fin.efectivo);
    const total: number = Utils.toNumber(this.vs.fin.total);

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

  openCaja(ev: number): void {
    this.header.abrirCaja();
  }
}
