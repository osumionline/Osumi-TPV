import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HeaderComponent } from "src/app/components/header/header.component";
import { VentaFinalizarModalComponent } from "src/app/components/modals/venta-finalizar-modal/venta-finalizar-modal.component";
import { TabsComponent } from "src/app/components/ventas/tabs/tabs.component";
import { UnaVentaComponent } from "src/app/components/ventas/una-venta/una-venta.component";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { Modal } from "src/app/interfaces/modals.interface";
import { ArticulosService } from "src/app/services/articulos.service";
import { ConfigService } from "src/app/services/config.service";
import { OverlayService } from "src/app/services/overlay.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.scss"],
})
export class VentasComponent implements OnInit {
  @ViewChild("tabs", { static: true }) tabs: TabsComponent;
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
        if (data.data.status === "cancelar") {
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
