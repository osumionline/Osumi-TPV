import {
  LineaVentaInterface,
  VentaInterface,
} from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
import { Empleado } from "src/app/model/empleado.model";
import { LineaVenta } from "src/app/model/linea-venta.model";
import { Rol } from "src/app/shared/rol.class";

export class Venta {
  name: string = "";
  cliente: Cliente = null;
  mostrarEmpleados: boolean = false;
  color: string = "#c0c8f7";
  textColor: string = "#fff";
  empleado: Empleado = null;
  modificarImportes: boolean = false;

  constructor(
    public id: number = null,
    public idEmpleado: number = null,
    public lineas: LineaVenta[] = [],
    public importe: number = 0
  ) {
    if (this.id === null) {
      const d: Date = new Date();
      this.id = d.getTime();
    }
  }

  updateImporte(): void {
    let cant: number = 0;
    for (let i in this.lineas) {
      this.lineas[i].updateImporte();
      cant += this.lineas[i].total;
    }
    this.importe = cant;
  }

  setCliente(c: Cliente): void {
    this.cliente = c;
  }

  setEmpleado(e: Empleado): void {
    this.empleado = e;
    this.idEmpleado = e.id;
    this.modificarImportes = e.hasRol(Rol.ventas.modificarImportes);
    this.color = e.color;
    this.textColor = e.textColor;
  }

  fromInterface(v: VentaInterface, lineas: LineaVenta[]): Venta {
    this.idEmpleado = v.idEmpleado;
    this.lineas = lineas;
    this.importe = v.importe;

    return this;
  }

  toInterface(): VentaInterface {
    const lineasVentas: LineaVentaInterface[] = [];
    for (let lv of this.lineas) {
      lineasVentas.push(lv.toInterface());
    }
    return {
      idEmpleado: this.idEmpleado,
      lineas: lineasVentas,
      importe: this.importe,
    };
  }
}
