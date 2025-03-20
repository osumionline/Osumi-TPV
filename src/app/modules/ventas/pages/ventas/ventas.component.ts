import {
  Component,
  HostListener,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  Signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { SelectClienteInterface } from '@interfaces/cliente.interface';
import Reserva from '@model/ventas/reserva.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import VentaFinalizarModalComponent from '@modules/ventas/components/modals/venta-finalizar-modal/venta-finalizar-modal.component';
import UnaVentaComponent from '@modules/ventas/components/una-venta/una-venta.component';
import VentasTabsComponent from '@modules/ventas/components/ventas-tabs/ventas-tabs.component';
import { Modal, OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import ConfigService from '@services/config.service';
import VentasService from '@services/ventas.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  imports: [VentasTabsComponent, UnaVentaComponent, HeaderComponent],
})
export default class VentasComponent implements OnInit {
  private ars: ArticulosService = inject(ArticulosService);
  public config: ConfigService = inject(ConfigService);
  public vs: VentasService = inject(VentasService);
  private overlayService: OverlayService = inject(OverlayService);

  id: InputSignalWithTransform<number | undefined, unknown> = input.required({
    transform: numberAttribute,
  });
  tabs: Signal<VentasTabsComponent> =
    viewChild.required<VentasTabsComponent>('tabs');
  ventas: Signal<readonly UnaVentaComponent[]> =
    viewChildren(UnaVentaComponent);

  header: Signal<HeaderComponent> =
    viewChild.required<HeaderComponent>('header');

  ngOnInit(): void {
    this.ars.returnInfo = null;
    if (this.id() !== undefined && !isNaN(this.id()) && this.id() !== 0) {
      this.newVenta(-1 * this.id());
      this.vs.ventaActual.mostrarEmpleados = this.config.empleados;
    } else {
      if (this.vs.selected === -1) {
        this.newVenta();
        this.vs.ventaActual.mostrarEmpleados = this.config.empleados;
      } else {
        this.startFocus();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === '+') {
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
    setTimeout((): void => {
      this.ventas()[this.vs.selected]?.setFocus(id);
    }, 0);
  }

  cerrarVenta(ind: number): void {
    if (this.vs.selected === ind) {
      this.vs.selected = 0;
    }
    this.vs.list.splice(ind, 1);
    for (const ind in this.vs.list) {
      this.vs.list[ind].tabName = 'VENTA ' + (parseInt(ind) + 1);
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
    for (const reserva of reservas) {
      for (const linea of reserva.lineas) {
        let ind: number = -1;
        if (linea.idArticulo !== null) {
          ind = this.vs.ventaActual.lineas.findIndex(
            (x: VentaLinea): boolean => {
              return x.idArticulo === linea.idArticulo;
            }
          );
        }
        if (ind === -1) {
          const lineaVenta: VentaLinea = new VentaLinea().fromLineaReserva(
            linea
          );
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

  endVenta(): void {
    if (this.vs.ventaActual.lineas.length === 1) {
      return;
    }
    this.vs.loadFinVenta();
    this.abreFinalizarVenta();
  }

  abreFinalizarVenta(): void {
    const modalFinalizarVentaData: Modal = {
      modalTitle: 'Finalizar venta',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(
      VentaFinalizarModalComponent,
      modalFinalizarVentaData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        if (data.data.status === 'cliente') {
          this.tabs().selectClient('venta');
        }
        if (data.data.status === 'factura') {
          this.tabs().selectClient('factura');
        }
        if (data.data.status === 'reserva') {
          this.tabs().selectClient('reserva');
        }
        if (data.data.status === 'cancelar') {
          this.ventas()[this.vs.selected]?.setFocus();
        }
        if (data.data.status === 'fin-reserva') {
          this.vs.cliente = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.ventas()[this.vs.selected]?.setFocus();
        }
        if (data.data.status === 'fin') {
          this.vs.cliente = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.ventas()[this.vs.selected]?.loadUltimaVenta(
            data.data.importe,
            data.data.cambio
          );
          this.ventas()[this.vs.selected]?.setFocus();
        }
      } else {
        this.ventas()[this.vs.selected]?.setFocus();
      }
    });
  }

  openCaja(): void {
    this.header().abrirCaja();
  }
}
