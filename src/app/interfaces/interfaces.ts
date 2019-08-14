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

export interface Proveedor {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
}

export interface ProveedoresResult {
  list: Proveedor[];
}

export interface Categoria {
  id: number;
  nombre: string;
  profundidad: number;
  hijos: Categoria[];
}

export interface CategoriasResult {
  list: Categoria;
}

export interface Articulo {
  id: number;
  localizador: number;
  nombre: string;
  puc: number;
  pvp: number;
  margen: number;
  idMarca: number;
  idProveedor: number;
  stock: number;
  stockMin: number;
  stockMax: number;
  loteOptimo: number;
  iva: number;
  fechaCaducidad: string;
  mostrarFecCad: boolean;
  observaciones: string;
  mostrarObsPedidos: boolean;
  mostrarObsVentas: boolean;
  referencia: string;
  ventaOnline: boolean;
  mostrarEnWeb: boolean;
  idCategoria: number;
  descCorta: string;
  desc: string;
}