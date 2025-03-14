import { TipoPagoInterface } from '@interfaces/tipo-pago.interface';

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
  nombreComercial: string;
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
  cajaInicial: number;
  ticketInicial: number;
  facturaInicial: number;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  secretApi: string;
  backupApiKey: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface AppDataResult {
  nombre: string;
  nombreComercial: string;
  cif: string;
  telefono: string;
  email: string;
  direccion: string;
  poblacion: string;
  twitter: string;
  facebook: string;
  instagram: string;
  web: string;
  cajaInicial: number;
  ticketInicial: number;
  facturaInicial: number;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  secretApi: string;
  backupApiKey: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface StartDataInterface {
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

export interface StatusIdMessageResult {
  status: string;
  id: number;
  message: string;
}

export interface StatusIdMessageErrorsResult {
  status: string;
  list: StatusIdMessageResult[];
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

export interface ReturnInfoInterface {
  where: string;
  id: number;
  extra: number;
}

export interface BackupInterface {
  id: number;
  idAccount: number;
  account: string;
  date: string;
}

export interface BackupResult {
  status: string;
  list: BackupInterface[];
}
