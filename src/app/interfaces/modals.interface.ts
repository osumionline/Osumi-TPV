import { Modal } from "src/app/interfaces/interfaces";
import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";

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
