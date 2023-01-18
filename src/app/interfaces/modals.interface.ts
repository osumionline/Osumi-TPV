import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";

export interface Modal {
  modalColor: "blue" | "yellow" | "red";
  modalTitle: string;
  hideCloseBtn?: boolean;
}

export interface BuscadorModal extends Modal {
  key: string;
}

export interface AccesosDirectosModal extends Modal {
  idArticulo: number;
}

export interface MargenesModal extends Modal {
  puc: number;
  list: number[];
}

export interface DarDeBajaModal extends Modal {
  id: number;
  nombre: string;
}

export interface DevolucionModal extends Modal {
  idVenta: number;
  list: DevolucionSelectedInterface[];
}

export interface VariosModal extends Modal {
  nombre: string;
  pvp: number;
  iva: number;
  re: number;
}
