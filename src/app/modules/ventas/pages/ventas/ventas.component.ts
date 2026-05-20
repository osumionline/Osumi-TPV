import {
  Component,
  ElementRef,
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
import ApiStatusEnum from '@enum/api-status.enum';
import { SelectClienteInterface } from '@interfaces/cliente.interface';
import { FinalizarVentaModal, FinalizarVentaModalResult } from '@interfaces/modals.interface';
import Cliente from '@model/clientes/cliente.model';
import Reserva from '@model/ventas/reserva.model';
import VentaFin from '@model/ventas/venta-fin.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import Venta from '@model/ventas/venta.model';
import UnaVentaComponent from '@modules/ventas/components/una-venta/una-venta.component';
import VentasTabsComponent from '@modules/ventas/components/ventas-tabs/ventas-tabs.component';
import VentaFinalizarModalComponent from '@modules/ventas/modals/venta-finalizar-modal/venta-finalizar-modal.component';
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
    { transform: this.toOptionalNumber },
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

  private setVentas(ventas: Venta[]): void {
    this.ventas.set(ventas);
    this.vs.setList(ventas);
  }

  private updateVentas(updateFn: (ventas: Venta[]) => Venta[]): void {
    this.ventas.update(updateFn);
    this.vs.setList(this.ventas());
  }

  private setSelected(ind: number): void {
    this.selected.set(ind);
    this.vs.setSelected(ind);
  }

  ngOnInit(): void {
    this.ars.returnInfo = null;
    const id: number | undefined = this.id();
    if (id !== undefined && !isNaN(id) && this.id() !== 0) {
      this.newVenta(-1 * id);
      const ventas: Venta[] = this.ventas();
      ventas[this.selected()].mostrarEmpleados = this.config.empleados;
      this.setVentas([...ventas]);
    } else {
      if (this.selected() === -1) {
        this.newVenta();
        const ventas: Venta[] = this.ventas();
        ventas[this.selected()].mostrarEmpleados = this.config.empleados;
        this.setVentas([...ventas]);
      } else {
        this.startFocus();
      }
    }
  }

  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === '+') {
      ev.preventDefault();
      this.endVenta(undefined);
    }
  }

  newVenta(id: number | null = null): void {
    const newVenta: Venta = this.vs.newVenta(
      this.config.empleados,
      this.config.idEmpleadoDef,
      this.config.colorEmpleadoDef,
      this.config.colorTextEmpleadoDef,
      id,
    );
    this.setVentas([...this.ventas(), newVenta]);
    this.setSelected(this.ventas().length - 1);
    if (!this.config.empleados) {
      this.startFocus(id);
    }
  }

  changeTab(ind: number): void {
    this.setSelected(ind);
    this.startFocus();
  }

  startFocus(id: number | null = null): void {
    setTimeout((): void => {
      this.ventasComponents()[this.selected()]?.setFocus(id);
    }, 0);
  }

  cerrarVenta(ind: number): void {
    const ventas: Venta[] = this.ventas();
    ventas.splice(ind, 1);
    for (const ind in ventas) {
      ventas[ind].tabName = 'VENTA ' + (parseInt(ind) + 1);
    }

    const selected: number = this.selected();
    let nextSelected: number = selected;
    if (ventas.length === 0) {
      nextSelected = -1;
    } else if (ind < selected) {
      nextSelected = selected - 1;
    } else if (ind === selected) {
      nextSelected = Math.min(ind, ventas.length - 1);
    }

    this.setVentas([...ventas]);
    this.setSelected(nextSelected);
  }

  deleteVentaLinea(ind: number): void {
    const ventas: Venta[] = this.ventas();
    const linea: VentaLinea = ventas[this.selected()].lineas[ind];
    if (linea.fromReserva === null) {
      ventas[this.selected()].lineas.splice(ind, 1);
    } else {
      linea.cantidad = 0;
    }
    ventas[this.selected()].updateImporte();
    this.setVentas([...ventas]);

    this.startFocus();
  }

  updateVenta(ind: number, venta: Venta): void {
    this.updateVentas((ventas: Venta[]): Venta[] => ventas.toSpliced(ind, 1, venta));
  }

  removeSelectedClient(): void {
    const idx: number = this.selected();
    const ventasArr: Venta[] = this.ventas();
    const venta: Venta = ventasArr[idx];
    if (!venta) {
      this.startFocus();
      return;
    }

    const cliente: Cliente | null = venta.cliente;
    venta.cliente = null;

    if (cliente !== null && cliente.descuento !== 0) {
      for (const linea of venta.lineas) {
        if (linea.localizador !== null && !linea.descuentoManual) {
          linea.descuento = 0;
        }
      }
      venta.updateImporte();
    }

    this.updateVentas((arr: Venta[]): Venta[] => arr.toSpliced(idx, 1, venta));
    this.startFocus();
  }

  selectClient(selected: SelectClienteInterface | null): void {
    if (!selected) {
      this.removeSelectedClient();
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
    this.updateVentas((arr: Venta[]): Venta[] => arr.toSpliced(idx, 1, venta));

    obs.subscribe((vActualizada: Venta): void => {
      this.updateVentas((arr: Venta[]): Venta[] => {
        const i: number = arr.indexOf(vActualizada);
        return i === -1 ? arr : arr.toSpliced(i, 1, vActualizada);
      });
    });

    if (selected.from == null) {
      this.startFocus();
    } else {
      const ventaFin: VentaFin = this.vs.loadFinVenta(this.ventas()[this.selected()]);
      this.abreFinalizarVenta(ventaFin, undefined);
    }
  }

  selectReserva(reservas: Reserva[]): void {
    if (!reservas.length) {
      return;
    }

    this.newVenta();
    const idx: number = this.selected();
    const ventasArr: Venta[] = this.ventas();
    const venta: Venta = ventasArr[idx];
    if (!venta) {
      return;
    }

    venta.mostrarEmpleados = this.config.empleados;
    venta.lineas = [];
    const cliente: Cliente | null = reservas[0].cliente;
    const stats$: Observable<Venta> = this.vs.loadVentaCliente(cliente as Cliente, venta);

    for (const reserva of reservas) {
      for (const linea of reserva.lineas) {
        let ind: number = -1;

        if (linea.idArticulo !== null) {
          ind = venta.lineas.findIndex(
            (x: VentaLinea): boolean => x.idArticulo === linea.idArticulo,
          );
        }

        if (ind === -1) {
          const lineaVenta: VentaLinea = new VentaLinea().fromLineaReserva(linea);
          lineaVenta.fromReserva = reserva.id;
          venta.lineas.push(lineaVenta);
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

    this.updateVentas((arr: Venta[]): Venta[] => arr.toSpliced(idx, 1, venta));

    stats$.subscribe((ventaConStats: Venta): void => {
      this.updateVentas((arr: Venta[]): Venta[] => {
        const i: number = arr.indexOf(ventaConStats);
        return i === -1 ? arr : arr.toSpliced(i, 1, ventaConStats);
      });
    });
  }

  endVenta(btnTerminar: ElementRef | undefined): void {
    const selected: number = this.selected();
    const venta: Venta = this.ventas()[selected];

    if (venta.lineas.length === 1) {
      return;
    }

    const ventaFin: VentaFin = this.vs.loadFinVenta(venta);
    this.abreFinalizarVenta(ventaFin, btnTerminar);
  }

  abreFinalizarVenta(ventaFin: VentaFin, btnTerminar: ElementRef | undefined): void {
    console.log({ btnTerminar: btnTerminar?.nativeElement });
    const modalFinalizarVentaData: FinalizarVentaModal = {
      modalTitle: 'Finalizar venta',
      modalColor: 'blue',
      fin: ventaFin,
    };
    const dialog = this.overlayService.open<FinalizarVentaModalResult>(
      VentaFinalizarModalComponent,
      modalFinalizarVentaData,
      [],
      true,
      btnTerminar?.nativeElement,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        if (data.data.status === ApiStatusEnum.CLIENTE) {
          this.tabs().selectClient('venta');
        }
        if (data.data.status === ApiStatusEnum.FACTURA) {
          this.tabs().selectClient('factura');
        }
        if (data.data.status === ApiStatusEnum.RESERVA) {
          this.tabs().selectClient('reserva');
        }
        if (data.data.status === ApiStatusEnum.CANCELAR) {
          this.ventasComponents()[this.selected()]?.setFocus();
        }
        if (data.data.status === ApiStatusEnum.FIN_RESERVA) {
          const ventas: Venta[] = this.ventas();
          ventas[this.selected()].cliente = null;
          ventas[this.selected()].resetearVenta();
          ventas[this.selected()].lineas.push(new VentaLinea());
          this.setVentas([...ventas]);
          this.ventasComponents()[this.selected()]?.setFocus();
        }
        if (
          data.data.status === ApiStatusEnum.FIN &&
          data.data.importe !== undefined &&
          data.data.cambio !== undefined
        ) {
          const ventas: Venta[] = this.ventas();
          ventas[this.selected()].cliente = null;
          ventas[this.selected()].resetearVenta();
          ventas[this.selected()].lineas.push(new VentaLinea());
          this.setVentas([...ventas]);
          this.ventasComponents()[this.selected()]?.loadUltimaVenta(
            data.data.importe,
            data.data.cambio,
          );
          this.ventasComponents()[this.selected()]?.setFocus();
        }
      } else {
        this.ventasComponents()[this.selected()]?.setFocus();
      }
    });
  }

  openCaja(): void {
    this.header().abrirCaja();
  }
}
