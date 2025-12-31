export interface ComercialInterface {
  id: number | null;
  idProveedor: number | null;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  observaciones: string | null;
}

export interface ProveedorInterface {
  id: number | null;
  nombre: string | null;
  foto: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  web: string | null;
  observaciones: string | null;
  marcas: number[];
  comerciales: ComercialInterface[];
}

export interface ProveedoresResult {
  list: ProveedorInterface[];
}
