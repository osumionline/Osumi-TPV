export interface MarcaInterface {
  id: number;
  nombre: string;
  direccion: string;
  foto: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
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
