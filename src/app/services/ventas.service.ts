import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ArticuloBuscadorResult } from "src/app/interfaces/articulo.interface";
import { HistoricoVentasResult } from "src/app/interfaces/caja.interface";
import { DateValues, StatusResult } from "src/app/interfaces/interfaces";
import { FinVentaResult } from "src/app/interfaces/venta.interface";
import { Articulo } from "src/app/model/articulo.model";
import { Cliente } from "src/app/model/cliente.model";
import { Empleado } from "src/app/model/empleado.model";
import { VentaFin } from "src/app/model/venta-fin.model";
import { VentaLinea } from "src/app/model/venta-linea.model";
import { Venta } from "src/app/model/venta.model";
import { Utils } from "src/app/shared/utils.class";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class VentasService {
  selected: number = -1;
  list: Venta[] = [];
  fin: VentaFin = new VentaFin();

  constructor(private http: HttpClient) {}

  newVenta(
    empleados: boolean,
    idEmpleadoDef: number,
    colorEmpleadoDef: string,
    colorTextEmpleadoDef: string,
    loadValue: number = null
  ): void {
    this.selected = this.list.length;
    const venta = new Venta();
    venta.name = "VENTA " + (this.list.length + 1);
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
    for (let venta of this.list) {
      for (let linea of venta.lineas) {
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

  loadFinVenta(): void {
    const lineas: VentaLinea[] = this.ventaActual.lineas.filter(
      (x: VentaLinea): boolean => x.idArticulo !== null
    );

    this.fin = new VentaFin(
      Utils.formatNumber(this.ventaActual.importe),
      "0",
      null,
      this.ventaActual.idEmpleado,
      null,
      this.cliente ? this.cliente.id : -1,
      Utils.formatNumber(this.ventaActual.importe),
      lineas,
      "si",
      this.cliente ? this.cliente.email : null
    );
  }

  guardarVenta(): Observable<FinVentaResult> {
    return this.http.post<FinVentaResult>(
      environment.apiUrl + "-ventas/save-venta",
      this.fin.toInterface()
    );
  }

  search(q: string): Observable<ArticuloBuscadorResult> {
    return this.http.post<ArticuloBuscadorResult>(
      environment.apiUrl + "-ventas/search",
      {
        q,
      }
    );
  }

  getHistorico(data: DateValues): Observable<HistoricoVentasResult> {
    return this.http.post<HistoricoVentasResult>(
      environment.apiUrl + "-ventas/get-historico",
      data
    );
  }

  asignarTipoPago(id: number, idTipoPago: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-ventas/asignar-tipo-pago",
      { id, idTipoPago }
    );
  }

  printTicket(id: number, regalo: boolean): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-ventas/print-ticket",
      { id, regalo }
    );
  }

  sendTicket(id: number, email: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-ventas/send-ticket",
      { id, email }
    );
  }
}
