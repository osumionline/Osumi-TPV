import { VentaHistoricoInterface } from "src/app/interfaces/caja.interface";
import {
  ArticuloTopVentaInterface,
  ArticuloUltimaVentaInterface,
} from "src/app/interfaces/venta.interface";
import { Cliente } from "src/app/model/clientes/cliente.model";

export interface ClienteInterface {
  id: number;
  nombreApellidos: string;
  dniCif: string;
  telefono: string;
  email: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: number;
  factIgual: boolean;
  factNombreApellidos: string;
  factDniCif: string;
  factTelefono: string;
  factEmail: string;
  factDireccion: string;
  factCodigoPostal: string;
  factPoblacion: string;
  factProvincia: number;
  observaciones: string;
  descuento: number;
  ultimaVenta: string;
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
  id: number;
  idCliente: number;
  numFactura: number;
  nombreApellidos: string;
  dniCif: string;
  telefono: string;
  email: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: number;
  importe: number;
  impresa: boolean;
  fecha: string;
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
  id: number;
  idCliente: number;
  ventas: number[];
  imprimir: boolean;
}

export interface ReservaLineaInterface {
  id: number;
  idArticulo: number;
  nombreArticulo: string;
  localizador: number;
  marca: string;
  stock: number;
  puc: number;
  pvp: number;
  iva: number;
  importe: number;
  descuento: number;
  importeDescuento: number;
  unidades: number;
}

export interface ReservaInterface {
  id: number;
  idCliente: number;
  cliente: ClienteInterface;
  total: number;
  fecha: string;
  lineas: ReservaLineaInterface[];
}

export interface ReservasResult {
  status: string;
  list: ReservaInterface[];
}
