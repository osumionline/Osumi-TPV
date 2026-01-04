import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ArticuloBuscadorResult } from '@interfaces/articulo.interface';
import { HistoricoVentasResult } from '@interfaces/caja.interface';
import { EstadisticasClienteResult } from '@interfaces/cliente.interface';
import { DateValues, StatusResult } from '@interfaces/interfaces';
import {
  FinVentaResult,
  LineasTicketResult,
  LocalizadoresResult,
} from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import Cliente from '@model/clientes/cliente.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import Empleado from '@model/tpv/empleado.model';
import VentaFin from '@model/ventas/venta-fin.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import Venta from '@model/ventas/venta.model';
import { DialogService } from '@osumi/angular-tools';
import { formatNumber } from '@osumi/tools';
import BaseService from '@services/base.service';
import ClientesService from '@services/clientes.service';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class VentasService extends BaseService {
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly dialog: DialogService = inject(DialogService);

  selected: WritableSignal<number> = signal<number>(-1);
  list: WritableSignal<Venta[]> = signal<Venta[]>([]);
  fin: VentaFin = new VentaFin();

  getList(): Venta[] {
    return this.list();
  }

  setList(ventas: Venta[]): void {
    this.list.set(ventas);
  }

  newVenta(
    empleados: boolean,
    idEmpleadoDef: number | null,
    colorEmpleadoDef: string | null,
    colorTextEmpleadoDef: string | null,
    loadValue: number | null = null
  ): Venta {
    this.selected.set(this.list().length);
    const venta = new Venta();
    venta.tabName = 'VENTA ' + (this.list().length + 1);
    venta.color = colorEmpleadoDef;
    venta.textColor = colorTextEmpleadoDef;
    venta.mostrarEmpleados = empleados;
    venta.loadValue = loadValue;
    if (!empleados) {
      venta.setEmpleado(new Empleado().fromDefault(idEmpleadoDef, colorEmpleadoDef));
      venta.lineas.push(new VentaLinea());
    }
    return venta;
  }

  addLineaVenta(): void {
    this.list.update((list: Venta[]): Venta[] => {
      list[this.selected()].lineas.push(new VentaLinea());
      return list;
    });
  }

  get ventaActual(): Venta {
    return this.list()[this.selected()];
  }

  updateArticulo(articulo: Articulo): void {
    this.list.update((list: Venta[]): Venta[] => {
      for (const venta of list) {
        for (const linea of venta.lineas) {
          if (linea.idArticulo === articulo.id) {
            linea.descripcion = articulo.nombre;
            linea.stock = articulo.stock;
            linea.pvp = articulo.pvp;
            linea.updateImporte();
          }
        }
        venta.updateImporte();
      }
      return list;
    });
  }

  loadVentaCliente(cliente: Cliente, venta: Venta): Observable<Venta> {
    this.fin.idCliente = cliente.id;
    this.fin.email = cliente.email;

    venta.cliente = cliente;

    if (cliente.descuento !== 0) {
      for (const linea of venta.lineas) {
        if (linea.localizador !== null) {
          linea.descuentoManual = false;
          linea.descuento = cliente.descuento;
        }
      }
      venta.updateImporte();
    }

    return this.cs.getEstadisticasCliente(cliente.id as number).pipe(
      tap((r: EstadisticasClienteResult): void => {
        if (r.status === ApiStatusEnum.OK) {
          venta.cliente!.ultimasVentas = this.cms.getUltimaVentaArticulos(r.ultimasVentas);
          venta.cliente!.topVentas = this.cms.getTopVentaArticulos(r.topVentas);
        } else {
          this.dialog.alert({
            title: 'Error',
            content: '¡Ocurrió un error al obtener las estadísticas del cliente!',
          });
        }
      }),
      map((): Venta => venta),
      catchError((): Observable<Venta> => {
        this.dialog.alert({
          title: 'Error',
          content: 'No se pudieron cargar las estadísticas del cliente.',
        });
        return of(venta);
      })
    );
  }

  loadFinVenta(venta: Venta): VentaFin {
    const lineas: VentaLinea[] = venta.lineas.filter(
      (x: VentaLinea): boolean => x.idArticulo !== null
    );

    return new VentaFin(
      formatNumber(venta.importe),
      '0',
      '0',
      venta.idEmpleado,
      null,
      venta.cliente ? venta.cliente.id : -1,
      formatNumber(venta.importe),
      lineas,
      'si',
      venta.cliente ? venta.cliente.email : null
    );
  }

  guardarVenta(): Observable<FinVentaResult> {
    return this.http.post<FinVentaResult>(
      this.apiUrl + '-ventas/save-venta',
      this.fin.toInterface()
    );
  }

  guardarReserva(): Observable<FinVentaResult> {
    return this.http.post<FinVentaResult>(
      this.apiUrl + '-clientes/save-reserva',
      this.fin.toInterface()
    );
  }

  search(q: string): Observable<ArticuloBuscadorResult> {
    return this.http.post<ArticuloBuscadorResult>(this.apiUrl + '-ventas/search', { q });
  }

  getLineasTicket(lineas: string): Observable<LineasTicketResult> {
    return this.http.post<LineasTicketResult>(this.apiUrl + '-ventas/get-lineas-ticket', {
      lineas,
    });
  }

  getLocalizadores(localizadores: string): Observable<LocalizadoresResult> {
    return this.http.post<LocalizadoresResult>(this.apiUrl + '-ventas/get-localizadores', {
      localizadores,
    });
  }

  getHistorico(data: DateValues): Observable<HistoricoVentasResult> {
    return this.http.post<HistoricoVentasResult>(this.apiUrl + '-ventas/get-historico', data);
  }

  asignarTipoPago(id: number, idTipoPago: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-ventas/asignar-tipo-pago', {
      id,
      idTipoPago,
    });
  }

  printTicket(id: number, tipo: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-ventas/print-ticket', { id, tipo });
  }

  sendTicket(id: number, email: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-ventas/send-ticket', { id, email });
  }
}
