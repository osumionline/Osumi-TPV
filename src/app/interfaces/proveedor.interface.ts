export interface ComercialInterface {
  id: number;
  idProveedor: number;
  nombre: string;
  telefono: string;
  email: string;
  observaciones: string;
}

export interface ProveedorInterface {
  id: number;
  nombre: string;
  foto: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
  marcas: number[];
  comerciales: ComercialInterface[];
}

export interface ProveedoresResult {
  list: ProveedorInterface[];
}
