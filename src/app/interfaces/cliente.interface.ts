import {
  ArticuloTopVentaInterface,
  ArticuloUltimaVentaInterface,
} from "./venta.interface";

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
  ultimaVenta: string;
}

export interface ClientesResult {
  status: string;
  list: ClienteInterface[];
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
