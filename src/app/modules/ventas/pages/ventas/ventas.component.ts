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
import Cliente from '@app/model/clientes/cliente.model';
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
import { Observable } from 'rxjs';

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

  toOptionalNumber = (v: unknown): number | undefined =>
    v == null ? undefined : numberAttribute(v);

  id: InputSignalWithTransform<number | undefined, unknown> = input<number | undefined, unknown>(
    undefined,
    { transform: this.toOptionalNumber }
  );
  tabs: Signal<VentasTabsComponent> = viewChild.required<VentasTabsComponent>('tabs');
  ventasComponents: Signal<readonly UnaVentaComponent[]> = viewChildren(UnaVentaComponent);
  header: Signal<HeaderComponent> = viewChild.required<HeaderComponent>('header');

  ventas: WritableSignal<Venta[]> = signal(this.vs.getList());
  selected: WritableSignal<number> = signal(this.vs.selected());

  get cliente(): Cliente | null {
    const ventaSelected: Venta = this.ventas()[this.selected()];
    return ventaSelected.cliente ? ventaSelected.cliente : null;
  }

  ngOnInit(): void {
    this.ars.returnInfo = null;
    const id: number | undefined = this.id();
    if (id !== undefined && !isNaN(id) && this.id() !== 0) {
      this.newVenta(-1 * id);
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

  newVenta(id: number | null = null): void {
    const newVenta: Venta = this.vs.newVenta(
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
    this.selected.set(this.ventas().length - 1);
    if (!this.config.empleados) {
      this.startFocus(id);
    }
  }

  changeTab(ind: number): void {
    this.selected.set(ind);
    this.startFocus();
  }

  startFocus(id: number | null = null): void {
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

  selectClient(selected: SelectClienteInterface | null): void {
    if (!selected) {
      this.startFocus();
      return;
    }

    const idx: number = this.selected();
    const ventasArr: Venta[] = this.ventas();
    const venta = ventasArr[idx];
    if (!venta) {
      this.startFocus();
      return;
    }

    const obs: Observable<Venta> = this.vs.loadVentaCliente(selected.cliente, venta);
    this.ventas.update((arr: Venta[]): Venta[] => arr.toSpliced(idx, 1, venta));

    obs.subscribe((vActualizada: Venta): void => {
      this.ventas.update((arr: Venta[]): Venta[] => {
        const i: number = arr.indexOf(vActualizada);
        return i === -1 ? arr : arr.toSpliced(i, 1, vActualizada);
      });
    });

    if (selected.from == null) {
      this.startFocus();
    } else {
      const ventaFin: VentaFin = this.vs.loadFinVenta(this.ventas()[this.selected()]);
      this.abreFinalizarVenta(ventaFin);
    }
  }

  selectReserva(reservas: Reserva[]): void {
    if (!reservas?.length) return;

    this.newVenta();
    const idx: number = this.selected();
    const ventasArr: Venta[] = this.ventas();
    const venta: Venta = ventasArr[idx];
    if (!venta) return;

    venta.mostrarEmpleados = this.config.empleados;
    venta.lineas = [];
    const cliente = reservas[0].cliente;

    const stats$: Observable<Venta> = this.vs.loadVentaCliente(cliente as Cliente, venta);

    for (const reserva of reservas) {
      for (const linea of reserva.lineas) {
        let ind: number = -1;

        if (linea.idArticulo !== null) {
          ind = venta.lineas.findIndex(
            (x: VentaLinea): boolean => x.idArticulo === linea.idArticulo
          );
        }

        if (ind === -1) {
          const lineaVenta: VentaLinea = new VentaLinea().fromLineaReserva(linea);
          lineaVenta.fromReserva = reserva.id;
          venta.lineas.push(lineaVenta);
        } else {
          let cantidad = venta.lineas[ind].cantidad;
          if (cantidad !== null) {
            cantidad += linea.unidades ?? 0;
          }
        }
      }
    }

    if (cliente !== null && cliente.descuento !== 0) {
      for (const l of venta.lineas) {
        if (l.localizador !== null) {
          l.descuentoManual = false;
          l.descuento = cliente.descuento;
        }
      }
    }

    venta.updateImporte();

    if (!this.config.empleados) {
      venta.lineas.push(new VentaLinea());
    }

    this.ventas.update((arr: Venta[]): Venta[] => arr.toSpliced(idx, 1, venta));

    stats$.subscribe((ventaConStats: Venta): void => {
      this.ventas.update((arr: Venta[]): Venta[] => {
        const i: number = arr.indexOf(ventaConStats);
        return i === -1 ? arr : arr.toSpliced(i, 1, ventaConStats);
      });
    });
  }

  endVenta(): void {
    if (this.ventas()[this.vs.selected()].lineas.length === 1) {
      return;
    }
    const ventaFin: VentaFin = this.vs.loadFinVenta(this.ventas()[this.vs.selected()]);
    this.abreFinalizarVenta(ventaFin);
  }

  abreFinalizarVenta(ventaFin: VentaFin): void {
    const modalFinalizarVentaData: FinalizarVentaModal = {
      modalTitle: 'Finalizar venta',
      modalColor: 'blue',
      fin: ventaFin,
    };
    const dialog = this.overlayService.open(VentaFinalizarModalComponent, modalFinalizarVentaData);
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
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].cliente = null;
            ventas[this.vs.selected()].resetearVenta();
            ventas[this.vs.selected()].lineas.push(new VentaLinea());
            return ventas;
          });
          this.ventasComponents()[this.vs.selected()]?.setFocus();
        }
        if (data.data.status === 'fin') {
          this.ventas.update((ventas: Venta[]): Venta[] => {
            ventas[this.vs.selected()].cliente = null;
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
