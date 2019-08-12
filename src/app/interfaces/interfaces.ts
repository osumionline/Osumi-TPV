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

export interface AppData {
  tipoIva: string;
  ivaList: number[];
  marginList: number[];
  ventaOnline: boolean;
  fechaCad: boolean;
}

export interface StartDataResult {
  status: string;
  opened: boolean;
  appData: AppData;
}

export interface StatusResult {
  status: string;
}

export interface Marca {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
}

export interface MarcasResult {
  list: Marca[];
}