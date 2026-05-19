import { DevolucionSelectedInterface, VentaVariosInterface } from '@interfaces/venta.interface';
import Caducidad from '@model/almacen/caducidad.model';
import Cliente from '@model/clientes/cliente.model';
import Factura from '@model/clientes/factura.model';
import Reserva from '@model/ventas/reserva.model';
import VentaFin from '@model/ventas/venta-fin.model';
import { Modal } from '@osumi/angular-tools';

export interface BuscadorModal extends Modal {
  key: string;
  showSelect?: boolean;
}

export interface BuscadorModalResult {
  result: number | null | number[];
}

export interface AccesosDirectosModal extends Modal {
  idArticulo: number | null;
}

export interface AccesosDirectosModalResult {
  result: number | null;
}

export interface MargenesModal extends Modal {
  puc: number;
  list: number[];
}

export interface MargenesModalResult {
  result: number | null;
}

export interface DarDeBajaModal extends Modal {
  id: number | null;
  nombre: string | null;
}

export interface DarDeBajaModalResult {
  result: boolean;
}

export interface DevolucionModal extends Modal {
  idVenta: number | null;
  list: DevolucionSelectedInterface[] | null;
}

export interface DevolucionModalResult {
  result: DevolucionSelectedInterface[];
}

export interface VariosModal extends Modal {
  nombre: string | null;
  pvp: number | null;
  iva: number | null;
}

export interface VariosModalResult {
  result: VentaVariosInterface | null;
}

export interface DescuentoModalResult {
  result: number;
}

export interface VentaAccesosDirectosModalResult {
  result: number | null;
}

export interface FinalizarVentaModal extends Modal {
  fin: VentaFin;
}

export interface FinalizarVentaModalResult {
  status: 'cliente' | 'factura' | 'reserva' | 'cancelar' | 'fin-reserva' | 'fin';
  importe?: number;
  cambio?: number;
}

export interface EmpleadoLoginModal extends Modal {
  id: number | null;
  nombre: string | null;
}

export interface EmpleadoLoginModalResult {
  result: boolean;
}

export interface ElegirClienteModal extends Modal {
  from: string | null;
}

export interface ElegirClienteModalResult {
  cliente: Cliente | null;
}

export interface BuscarClienteModalResult {
  cliente: Cliente | null;
}

export interface FacturaModal extends Modal {
  id: number | null;
  factura: Factura | null;
}

export interface FacturaModalResult {
  result: number | null;
}

export interface CajaModal extends Modal {
  option: string;
}

export interface ReservasModalResult {
  list: (Reserva | null)[];
}

export interface NewProveedorModalResult {
  result: number | null;
}

export interface NewMarcaModalResult {
  result: number | null;
}

export interface CaducidadModalResult {
  result: Caducidad | null;
}
