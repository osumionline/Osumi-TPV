export interface MarcaInterface {
  id: number | null;
  nombre: string | null;
  direccion: string | null;
  foto: string | null;
  telefono: string | null;
  email: string | null;
  web: string | null;
  observaciones: string | null;
  proveedor: string | null;
  crearProveedor?: boolean;
}

export interface MarcasResult {
  list: MarcaInterface[];
}

export interface SelectMarcaInterface {
  id: number;
  nombre: string;
  selected: boolean;
}
