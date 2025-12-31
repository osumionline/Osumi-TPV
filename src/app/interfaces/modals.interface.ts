import { DevolucionSelectedInterface } from '@interfaces/venta.interface';
import Factura from '@model/clientes/factura.model';
import VentaFin from '@model/ventas/venta-fin.model';
import { Modal } from '@osumi/angular-tools';

export interface BuscadorModal extends Modal {
  key: string;
  showSelect?: boolean;
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
  idVenta: number | null;
  list: DevolucionSelectedInterface[] | null;
}

export interface VariosModal extends Modal {
  nombre: string | null;
  pvp: number | null;
  iva: number;
}

export interface FinalizarVentaModal extends Modal {
  fin: VentaFin;
}

export interface EmpleadoLoginModal extends Modal {
  id: number | null;
  nombre: string | null;
}

export interface ElegirClienteModal extends Modal {
  from: string | null;
}

export interface FacturaModal extends Modal {
  id: number;
  factura: Factura;
}

export interface CajaModal extends Modal {
  option: string;
}
