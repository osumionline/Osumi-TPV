import { NgClass, NgStyle } from '@angular/common';
import {
  Component,
  Input,
  OutputEmitterRef,
  inject,
  output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SelectClienteInterface } from '@interfaces/cliente.interface';
import { ElegirClienteModal } from '@interfaces/modals.interface';
import Cliente from '@model/clientes/cliente.model';
import Reserva from '@model/ventas/reserva.model';
import ElegirClienteModalComponent from '@modules/ventas/components/modals/elegir-cliente-modal/elegir-cliente-modal.component';
import ReservasModalComponent from '@modules/ventas/components/modals/reservas-modal/reservas-modal.component';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import VentasService from '@services/ventas.service';

@Component({
  standalone: true,
  selector: 'otpv-ventas-tabs',
  templateUrl: './ventas-tabs.component.html',
  styleUrls: ['./ventas-tabs.component.scss'],
  imports: [NgClass, NgStyle, RouterModule, MatIcon, MatTooltip],
})
export default class VentasTabsComponent {
  private dialog: DialogService = inject(DialogService);
  public vs: VentasService = inject(VentasService);
  private overlayService: OverlayService = inject(OverlayService);

  @Input() showClose: boolean = false;
  closeTabEvent: OutputEmitterRef<number> = output<number>();
  newTabEvent: OutputEmitterRef<number> = output<number>();
  changeTabEvent: OutputEmitterRef<number> = output<number>();
  selectClientEvent: OutputEmitterRef<SelectClienteInterface> =
    output<SelectClienteInterface>();
  selectReservaEvent: OutputEmitterRef<Reserva[]> = output<Reserva[]>();

  selectClienteFrom: string = null;

  selectTab(ind: number): void {
    this.vs.selected = ind;
    this.changeTabEvent.emit(ind);
  }

  closeTab(ind: number): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer cerrar esta venta?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.closeTabEvent.emit(ind);
        }
      });
  }

  newTab(): void {
    this.newTabEvent.emit(0);
  }

  selectClient(from: string = null): void {
    this.selectClienteFrom = from;
    const modalnewProveedorData: ElegirClienteModal = {
      modalTitle: 'Seleccionar cliente',
      modalColor: 'blue',
      from: from,
    };
    const dialog = this.overlayService.open(
      ElegirClienteModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        const cliente: Cliente = data.data;
        this.selectClientEvent.emit({
          cliente: cliente,
          from: this.selectClienteFrom,
        });
      }
    });
  }

  removeClient(): void {
    this.vs.cliente = null;
    this.selectClientEvent.emit(null);
  }

  showReservas(): void {
    const modalReservasData: Modal = {
      modalTitle: 'Reservas',
      modalColor: 'blue',
      css: 'modal-wide',
    };
    const dialog = this.overlayService.open(
      ReservasModalComponent,
      modalReservasData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.selectReservaEvent.emit(data.data);
      }
    });
  }
}
