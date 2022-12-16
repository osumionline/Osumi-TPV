export interface EmpleadoInterface {
  id: number;
  nombre: string;
  hasPassword: boolean;
  color: string;
  roles: number[];
}

export interface EmpleadoLoginInterface {
  id: number;
  pass: string;
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
