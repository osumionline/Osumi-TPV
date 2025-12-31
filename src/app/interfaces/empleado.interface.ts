export interface EmpleadoInterface {
  id: number | null;
  nombre: string | null;
  hasPassword: boolean;
  color: string | null;
  roles: number[];
}

export interface EmpleadoLoginInterface {
  id: number | null;
  pass: string | null;
}

export interface EmpleadosResult {
  list: EmpleadoInterface[];
}

export interface EmpleadoSaveInterface {
  id: number;
  nombre: string;
  hasPassword: boolean;
  password: string;
  confirmPassword: string;
  color: string;
  roles: number[];
}
