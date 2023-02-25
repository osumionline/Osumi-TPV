import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { Modal } from "src/app/interfaces/modals.interface";
import { Reserva } from "src/app/model/ventas/reserva.model";
import { VentaLinea } from "src/app/model/ventas/venta-linea.model";
import { HeaderComponent } from "src/app/modules/standalone/components/header/header.component";
import { VentaFinalizarModalComponent } from "src/app/modules/ventas/components/modals/venta-finalizar-modal/venta-finalizar-modal.component";
import { UnaVentaComponent } from "src/app/modules/ventas/components/una-venta/una-venta.component";
import { VentasTabsComponent } from "src/app/modules/ventas/components/ventas-tabs/ventas-tabs.component";
import { ArticulosService } from "src/app/services/articulos.service";
import { ConfigService } from "src/app/services/config.service";
import { OverlayService } from "src/app/services/overlay.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.scss"],
  imports: [
    CommonModule,
    VentasTabsComponent,
    UnaVentaComponent,
    HeaderComponent,
  ],
})
export class VentasComponent implements OnInit {
  @ViewChild("tabs", { static: true }) tabs: VentasTabsComponent;
  @ViewChildren("ventas") ventas: QueryList<UnaVentaComponent>;
  @ViewChild("header", { static: true }) header: HeaderComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ars: ArticulosService,
    public config: ConfigService,
    public vs: VentasService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.ars.returnInfo = null;
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

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "+") {
      ev.preventDefault();
      this.endVenta();
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
      this.startFocus(id);
    }
  }

  startFocus(id: number = null): void {
    setTimeout(() => {
      this.ventas.get(this.vs.selected).setFocus(id);
    }, 0);
  }

  cerrarVenta(ind: number): void {
    if (this.vs.selected === ind) {
      this.vs.selected = 0;
    }
    this.vs.list.splice(ind, 1);
    for (let ind in this.vs.list) {
      this.vs.list[ind].tabName = "VENTA " + (parseInt(ind) + 1);
    }
  }

  deleteVentaLinea(ind: number): void {
    const linea: VentaLinea = this.vs.ventaActual.lineas[ind];
    if (linea.fromReserva === null) {
      this.vs.ventaActual.lineas.splice(ind, 1);
    } else {
      linea.cantidad = 0;
    }
    this.vs.ventaActual.updateImporte();
    this.startFocus();
  }

  selectClient(selected: SelectClienteInterface): void {
    if (selected !== null) {
      this.vs.loadVentaCliente(selected.cliente);
    }
    if (selected === null || selected.from === null) {
      this.startFocus();
    } else {
      this.abreFinalizarVenta();
    }
  }

  selectReserva(reservas: Reserva[]): void {
    this.newVenta();
    this.vs.ventaActual.mostrarEmpleados = this.config.empleados;
    this.vs.loadVentaCliente(reservas[0].cliente);
    this.vs.ventaActual.lineas = [];
    for (let reserva of reservas) {
      for (let linea of reserva.lineas) {
        let ind: number = -1;
        if (linea.idArticulo !== null) {
          ind = this.vs.ventaActual.lineas.findIndex(
            (x: VentaLinea): boolean => {
              return x.idArticulo === linea.idArticulo;
            }
          );
        }
        if (ind === -1) {
          let lineaVenta: VentaLinea = new VentaLinea().fromLineaReserva(linea);
          lineaVenta.fromReserva = reserva.id;
          this.vs.ventaActual.lineas.push(lineaVenta);
        } else {
          this.vs.ventaActual.lineas[ind].cantidad += linea.unidades;
        }
      }
    }
    this.vs.ventaActual.updateImporte();
    if (!this.config.empleados) {
      this.vs.addLineaVenta();
    }
  }

  endVenta(id: number = null): void {
    if (this.vs.ventaActual.lineas.length === 1) {
      return;
    }
    this.vs.loadFinVenta();
    this.abreFinalizarVenta();
  }

  abreFinalizarVenta(): void {
    const modalFinalizarVentaData: Modal = {
      modalTitle: "Finalizar venta",
      modalColor: "blue",
    };
    const dialog = this.overlayService.open(
      VentaFinalizarModalComponent,
      modalFinalizarVentaData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        if (data.data.status === "cliente") {
          this.tabs.selectClient("venta");
        }
        if (data.data.status === "factura") {
          this.tabs.selectClient("factura");
        }
        if (data.data.status === "reserva") {
          this.tabs.selectClient("reserva");
        }
        if (data.data.status === "cancelar") {
          this.ventas.get(this.vs.selected).setFocus();
        }
        if (data.data.status === "fin-reserva") {
          this.vs.cliente = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.ventas.get(this.vs.selected).setFocus();
        }
        if (data.data.status === "fin") {
          this.vs.cliente = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.ventas
            .get(this.vs.selected)
            .loadUltimaVenta(data.data.importe, data.data.cambio);
          this.ventas.get(this.vs.selected).setFocus();
        }
      } else {
        this.ventas.get(this.vs.selected).setFocus();
      }
    });
  }

  openCaja(ev: number): void {
    this.header.abrirCaja();
  }
}
