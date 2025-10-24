import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  signal,
  Signal,
  viewChild,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { FinalizarVentaModal } from '@app/interfaces/modals.interface';
import VentaFin from '@app/model/ventas/venta-fin.model';
import { SelectClienteInterface } from '@interfaces/cliente.interface';
import Reserva from '@model/ventas/reserva.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import Venta from '@model/ventas/venta.model';
import VentaFinalizarModalComponent from '@modules/ventas/components/modals/venta-finalizar-modal/venta-finalizar-modal.component';
import UnaVentaComponent from '@modules/ventas/components/una-venta/una-venta.component';
import VentasTabsComponent from '@modules/ventas/components/ventas-tabs/ventas-tabs.component';
import { OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import ConfigService from '@services/config.service';
import VentasService from '@services/ventas.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  imports: [VentasTabsComponent, UnaVentaComponent, HeaderComponent],
  host: {
    'window:keydown': 'onKeyDown($event)',
  },
})
export default class VentasComponent implements OnInit {
  private readonly ars: ArticulosService = inject(ArticulosService);
  private readonly config: ConfigService = inject(ConfigService);
  private readonly vs: VentasService = inject(VentasService);
  private readonly overlayService: OverlayService = inject(OverlayService);

  id: InputSignalWithTransform<number | undefined, unknown> = input.required({
    transform: numberAttribute,
  });
  tabs: Signal<VentasTabsComponent> =
    viewChild.required<VentasTabsComponent>('tabs');
  ventasComponents: Signal<readonly UnaVentaComponent[]> =
    viewChildren(UnaVentaComponent);
  header: Signal<HeaderComponent> =
    viewChild.required<HeaderComponent>('header');

  ventas: WritableSignal<Venta[]> = signal(this.vs.getList());
  selected: WritableSignal<number> = signal(this.vs.selected());

  ngOnInit(): void {
    this.ars.returnInfo = null;
    if (this.id() !== undefined && !isNaN(this.id()) && this.id() !== 0) {
      this.newVenta(-1 * this.id());
      this.ventas.update((ventas: Venta[]): Venta[] => {
        ventas[this.vs.selected()].mostrarEmpleados = this.config.empleados;
        return ventas;
      });
    } else {
      if (this.vs.selected() === -1) {
        this.newVenta();
        this.ventas.update((ventas: Venta[]): Venta[] => {
          ventas[this.vs.selected()].mostrarEmpleados = this.config.empleados;
          return ventas;
        });
      } else {
        this.startFocus();
      }
    }
  }

  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === '+') {
      ev.preventDefault();
      this.endVenta();
    }
  }

  newVenta(id: number = null): void {
    const newVenta = this.vs.newVenta(
      this.config.empleados,
      this.config.idEmpleadoDef,
      this.config.colorEmpleadoDef,
      this.config.colorTextEmpleadoDef,
      id
    );
    this.ventas.update((ventas: Venta[]): Venta[] => {
      ventas.push(newVenta);
      return ventas;
    });
    if (!this.config.empleados) {
      this.startFocus(id);
    }
  }

  changeTab(ind: number): void {
    this.selected.set(ind);
    this.startFocus();
  }

  startFocus(id: number = null): void {
    setTimeout((): void => {
      this.ventasComponents()[this.selected()]?.setFocus(id);
    }, 0);
  }

  cerrarVenta(ind: number): void {
    if (this.selected() === ind) {
      this.selected.set(0);
    }
    this.ventas.update((ventas: Venta[]): Venta[] => {
      ventas.splice(ind, 1);
      for (const ind in ventas) {
        ventas[ind].tabName = 'VENTA ' + (parseInt(ind) + 1);
      }
      return ventas;
    });
  }

  deleteVentaLinea(ind: number): void {
    this.ventas.update((ventas: Venta[]): Venta[] => {
      const linea: VentaLinea = ventas[this.selected()].lineas[ind];
      if (linea.fromReserva === null) {
        ventas[this.selected()].lineas.splice(ind, 1);
      } else {
        linea.cantidad = 0;
      }
      ventas[this.selected()].updateImporte();
      return ventas;
    });
    this.startFocus();
  }

  selectClient(selected: SelectClienteInterface): void {
    if (selected !== null) {
      this.ventas.update((ventas: Venta[]): Venta[] => {
        ventas[this.vs.selected()] = this.vs.loadVentaCliente(
          selected.cliente,
          ventas[this.vs.selected()]
        );
        return ventas;
      });
    }
    if (selected === null || selected.from === null) {
      this.startFocus();
    } else {
      const ventaFin: VentaFin = this.vs.loadFinVenta(
        this.ventas()[this.vs.selected()]
      );
      this.abreFinalizarVenta(ventaFin);
    }
  }

  selectReserva(reservas: Reserva[]): void {
    this.newVenta();
    this.ventas.update((ventas: Venta[]): Venta[] => {
      ventas[this.vs.selected()].mostrarEmpleados = this.config.empleados;
      ventas[this.vs.selected()] = this.vs.loadVentaCliente(
        reservas[0].cliente,
        ventas[this.vs.selected()]
      );
      ventas[this.vs.selected()].lineas = [];
      return ventas;
    });
    for (const reserva of reservas) {
      for (const linea of reserva.lineas) {
        let ind: number = -1;
        if (linea.idArticulo !== null) {
          ind = this.ventas()[this.vs.selected()].lineas.findIndex(
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
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].lineas.push(lineaVenta);
            return ventas;
          });
        } else {
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].lineas[ind].cantidad += linea.unidades;
            return ventas;
          });
        }
      }
    }
    this.ventas.update((ventas: Venta[]): Venta[] => {
      ventas[this.vs.selected()].updateImporte();
      return ventas;
    });
    if (!this.config.empleados) {
      this.ventas.update((ventas: Venta[]): Venta[] => {
        ventas[this.vs.selected()].lineas.push(new VentaLinea());
        return ventas;
      });
    }
  }

  endVenta(): void {
    if (this.ventas()[this.vs.selected()].lineas.length === 1) {
      return;
    }
    const ventaFin: VentaFin = this.vs.loadFinVenta(
      this.ventas()[this.vs.selected()]
    );
    this.abreFinalizarVenta(ventaFin);
  }

  abreFinalizarVenta(ventaFin: VentaFin): void {
    const modalFinalizarVentaData: FinalizarVentaModal = {
      modalTitle: 'Finalizar venta',
      modalColor: 'blue',
      fin: ventaFin,
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
          this.ventasComponents()[this.vs.selected()]?.setFocus();
        }
        if (data.data.status === 'fin-reserva') {
          this.vs.cliente = null;
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].resetearVenta();
            ventas[this.vs.selected()].lineas.push(new VentaLinea());
            return ventas;
          });
          this.ventasComponents()[this.vs.selected()]?.setFocus();
        }
        if (data.data.status === 'fin') {
          this.vs.cliente = null;
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].resetearVenta();
            ventas[this.vs.selected()].lineas.push(new VentaLinea());
            return ventas;
          });
          this.ventasComponents()[this.vs.selected()]?.loadUltimaVenta(
            data.data.importe,
            data.data.cambio
          );
          this.ventasComponents()[this.vs.selected()]?.setFocus();
        }
      } else {
        this.ventasComponents()[this.vs.selected()]?.setFocus();
      }
    });
  }

  openCaja(): void {
    this.header().abrirCaja();
  }
}
