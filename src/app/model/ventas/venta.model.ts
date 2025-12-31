import { VentaInterface, VentaLineaInterface } from '@interfaces/venta.interface';
import Cliente from '@model/clientes/cliente.model';
import Empleado from '@model/tpv/empleado.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import { rolList } from '@shared/rol.class';

export default class Venta {
  tabName: string = '';
  cliente: Cliente | null = null;
  mostrarEmpleados: boolean = false;
  color: string | null = '#c0c8f7';
  textColor: string | null = '#fff';
  empleado: Empleado | null = null;
  modificarImportes: boolean = false;

  loadValue: number | null = null;

  constructor(
    public id: number | null = null,
    public idEmpleado: number | null = null,
    public lineas: VentaLinea[] = [],
    public importe: number = 0
  ) {
    if (this.id === null) {
      const d: Date = new Date();
      this.id = d.getTime();
    }
  }

  updateImporte(): void {
    let cant: number = 0;
    for (const i in this.lineas) {
      this.lineas[i].updateImporte();
      cant += this.lineas[i].total ?? 0;
    }
    this.importe = cant;
  }

  setCliente(c: Cliente): void {
    this.cliente = c;
  }

  setEmpleado(e: Empleado): void {
    this.empleado = e;
    this.idEmpleado = e.id;
    this.modificarImportes = e.hasRol(rolList['ventas'].roles['modificarImportes'].id);
    this.color = e.color;
    this.textColor = e.textColor;
  }

  resetearVenta(): void {
    this.lineas = [];
    this.updateImporte();
  }

  fromInterface(v: VentaInterface, lineas: VentaLinea[]): Venta {
    this.idEmpleado = v.idEmpleado;
    this.lineas = lineas;
    this.importe = v.importe;

    return this;
  }

  toInterface(): VentaInterface {
    return {
      idEmpleado: this.idEmpleado,
      lineas: this.lineas.map((lv: VentaLinea): VentaLineaInterface => lv.toInterface()),
      importe: this.importe,
    };
  }
}
