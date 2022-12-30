import { TipoPagoInterface } from "./tipo-pago.interface";

export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  fields?: DialogField[];
  ok: string;
  cancel?: string;
}

export interface Month {
  id: number;
  name: string;
  days: number;
}

export interface ProvinceInterface {
  id: number;
  name: string;
}

export interface CCAAInterface {
  name: string;
  provinces: ProvinceInterface[];
}

export interface AllProvincesInterface {
  ccaa: CCAAInterface[];
}

export interface IvaReOptionInterface {
  id: string;
  name: string;
}

export interface IvaOptionInterface {
  option: number;
  selected: boolean;
}

export interface MarginOptionInterface {
  value: number;
  checked: boolean;
}

export interface AppDataInterface {
  nombre: string;
  cif: string;
  telefono: string;
  direccion: string;
  poblacion: string;
  email: string;
  logo: string;
  nombreEmpleado: string;
  pass: string;
  color: string;
  twitter: string;
  facebook: string;
  instagram: string;
  web: string;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface AppDataResult {
  nombre: string;
  cif: string;
  telefono: string;
  email: string;
  direccion: string;
  poblacion: string;
  twitter: string;
  facebook: string;
  instagram: string;
  web: string;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface StartDataInterface {
  status: string;
  opened: boolean;
  appData: AppDataResult;
  tiposPago: TipoPagoInterface[];
}

export interface StatusResult {
  status: string;
}

export interface IdSaveResult {
  status: string;
  id: number;
}

export interface ColorValues {
  r: number;
  g: number;
  b: number;
}

export interface DateValues {
  modo: string;
  id: number;
  fecha: string;
  desde: string;
  hasta: string;
}
