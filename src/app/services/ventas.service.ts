import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ArticuloBuscadorResult } from '@interfaces/articulo.interface';
import { HistoricoVentasResult } from '@interfaces/caja.interface';
import { EstadisticasClienteResult } from '@interfaces/cliente.interface';
import { DateValues, StatusResult } from '@interfaces/interfaces';
import {
  FinVentaResult,
  LineasTicketResult,
} from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import Cliente from '@model/clientes/cliente.model';
import Empleado from '@model/tpv/empleado.model';
import VentaFin from '@model/ventas/venta-fin.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import Venta from '@model/ventas/venta.model';
import { DialogService } from '@osumi/angular-tools';
import { formatNumber } from '@osumi/tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class VentasService {
  private http: HttpClient = inject(HttpClient);
  private cs: ClientesService = inject(ClientesService);
  private dialog: DialogService = inject(DialogService);
  private cms: ClassMapperService = inject(ClassMapperService);

  selected: number = -1;
  list: Venta[] = [];
  fin: VentaFin = new VentaFin();

  newVenta(
    empleados: boolean,
    idEmpleadoDef: number,
    colorEmpleadoDef: string,
    colorTextEmpleadoDef: string,
    loadValue: number = null
  ): void {
    this.selected = this.list.length;
    const venta = new Venta();
    venta.tabName = 'VENTA ' + (this.list.length + 1);
    venta.color = colorEmpleadoDef;
    venta.textColor = colorTextEmpleadoDef;
    venta.mostrarEmpleados = empleados;
    venta.loadValue = loadValue;
    this.list.push(venta);
    if (!empleados) {
      this.ventaActual.setEmpleado(
        new Empleado().fromDefault(idEmpleadoDef, colorEmpleadoDef)
      );
      this.addLineaVenta();
    }
  }

  addLineaVenta(): void {
    this.ventaActual.lineas.push(new VentaLinea());
  }

  get ventaActual(): Venta {
    return this.list[this.selected];
  }

  updateArticulo(articulo: Articulo): void {
    for (const venta of this.list) {
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
  }

  set cliente(c: Cliente) {
    this.ventaActual.setCliente(c);
  }

  get cliente(): Cliente {
    return this.ventaActual
      ? this.ventaActual.cliente
        ? this.ventaActual.cliente
        : null
      : null;
  }

  loadVentaCliente(cliente: Cliente): void {
    this.cliente = cliente;
    this.fin.idCliente = cliente.id;
    this.fin.email = cliente.email;
    if (cliente.descuento !== 0) {
      for (const linea of this.ventaActual.lineas) {
        if (linea.localizador !== null) {
          linea.descuentoManual = false;
          linea.descuento = cliente.descuento;
        }
      }
      this.ventaActual.updateImporte();
    }
    this.cs
      .getEstadisticasCliente(cliente.id)
      .subscribe((result: EstadisticasClienteResult): void => {
        if (result.status === 'ok') {
          this.cliente.ultimasVentas = this.cms.getUltimaVentaArticulos(
            result.ultimasVentas
          );
          this.cliente.topVentas = this.cms.getTopVentaArticulos(
            result.topVentas
          );
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              '¡Ocurrió un error al obtener las estadísticas del cliente!',
          });
        }
      });
  }

  loadFinVenta(): void {
    const lineas: VentaLinea[] = this.ventaActual.lineas.filter(
      (x: VentaLinea): boolean => x.idArticulo !== null
    );

    this.fin = new VentaFin(
      formatNumber(this.ventaActual.importe),
      '0',
      null,
      this.ventaActual.idEmpleado,
      null,
      this.cliente ? this.cliente.id : -1,
      formatNumber(this.ventaActual.importe),
      lineas,
      'si',
      this.cliente ? this.cliente.email : null
    );
  }

  guardarVenta(): Observable<FinVentaResult> {
    return this.http.post<FinVentaResult>(
      environment.apiUrl + '-ventas/save-venta',
      this.fin.toInterface()
    );
  }

  guardarReserva(): Observable<FinVentaResult> {
    return this.http.post<FinVentaResult>(
      environment.apiUrl + '-clientes/save-reserva',
      this.fin.toInterface()
    );
  }

  search(q: string): Observable<ArticuloBuscadorResult> {
    return this.http.post<ArticuloBuscadorResult>(
      environment.apiUrl + '-ventas/search',
      {
        q,
      }
    );
  }

  getLineasTicket(lineas: string): Observable<LineasTicketResult> {
    return this.http.post<LineasTicketResult>(
      environment.apiUrl + '-ventas/get-lineas-ticket',
      { lineas }
    );
  }

  getHistorico(data: DateValues): Observable<HistoricoVentasResult> {
    return this.http.post<HistoricoVentasResult>(
      environment.apiUrl + '-ventas/get-historico',
      data
    );
  }

  asignarTipoPago(id: number, idTipoPago: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + '-ventas/asignar-tipo-pago',
      { id, idTipoPago }
    );
  }

  printTicket(id: number, tipo: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + '-ventas/print-ticket',
      { id, tipo }
    );
  }

  sendTicket(id: number, email: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + '-ventas/send-ticket',
      { id, email }
    );
  }
}
