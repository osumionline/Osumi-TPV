import { VentaHistoricoInterface } from '@interfaces/caja.interface';
import {
  ArticuloTopVentaInterface,
  ArticuloUltimaVentaInterface,
} from '@interfaces/venta.interface';
import Cliente from '@model/clientes/cliente.model';

export interface ClienteInterface {
  id: number | null;
  nombreApellidos: string | null;
  dniCif: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  codigoPostal: string | null;
  poblacion: string | null;
  provincia: number | null;
  factIgual: boolean;
  factNombreApellidos: string | null;
  factDniCif: string | null;
  factTelefono: string | null;
  factEmail: string | null;
  factDireccion: string | null;
  factCodigoPostal: string | null;
  factPoblacion: string | null;
  factProvincia: number | null;
  observaciones: string | null;
  descuento: number;
  ultimaVenta: string | null;
}

export interface ClientesResult {
  status: string;
  list: ClienteInterface[];
}

export interface ClienteResult {
  status: string;
  cliente: ClienteInterface;
}

export interface ClienteSaveResult {
  status: string;
  id: number;
}

export interface EstadisticasClienteResult {
  status: string;
  ultimasVentas: ArticuloUltimaVentaInterface[];
  topVentas: ArticuloTopVentaInterface[];
}

export interface SelectClienteInterface {
  cliente: Cliente;
  from: string;
}

export interface FacturaInterface {
  id: number | null;
  idCliente: number | null;
  numFactura: number | null;
  nombreApellidos: string | null;
  dniCif: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  codigoPostal: string | null;
  poblacion: string | null;
  provincia: number | null;
  importe: number | null;
  impresa: boolean;
  fecha: string | null;
  ventas: VentaHistoricoInterface[];
}

export interface FacturasResult {
  status: string;
  list: FacturaInterface[];
}

export interface FacturaResult {
  status: string;
  factura: FacturaInterface;
}

export interface VentasClienteResult {
  status: string;
  list: VentaHistoricoInterface[];
}

export interface FacturaSaveInterface {
  id: number | null;
  idCliente: number | null;
  ventas: (number | null)[];
  imprimir: boolean;
}

export interface ReservaLineaInterface {
  id: number | null;
  idArticulo: number | null;
  nombreArticulo: string | null;
  localizador: number | null;
  marca: string | null;
  stock: number | null;
  puc: number | null;
  pvp: number | null;
  iva: number | null;
  importe: number | null;
  descuento: number | null;
  importeDescuento: number | null;
  unidades: number | null;
}

export interface ReservaInterface {
  id: number | null;
  idCliente: number | null;
  cliente: ClienteInterface | null;
  total: number | null;
  fecha: string | null;
  lineas: ReservaLineaInterface[];
}

export interface ReservasResult {
  status: string;
  list: ReservaInterface[];
}

export interface FacturaIVAInterface {
  iva: number;
  importe: number;
}
