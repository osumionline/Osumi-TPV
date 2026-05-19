import { Component, InputSignal, OutputEmitterRef, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import Venta from '@app/model/ventas/venta.model';
import { SelectClienteInterface } from '@interfaces/cliente.interface';
import {
  ElegirClienteModal,
  ElegirClienteModalResult,
  ReservasModalResult,
} from '@interfaces/modals.interface';
import Cliente from '@model/clientes/cliente.model';
import Reserva from '@model/ventas/reserva.model';
import ElegirClienteModalComponent from '@modules/ventas/components/modals/elegir-cliente-modal/elegir-cliente-modal.component';
import ReservasModalComponent from '@modules/ventas/components/modals/reservas-modal/reservas-modal.component';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';

@Component({
  selector: 'otpv-ventas-tabs',
  templateUrl: './ventas-tabs.component.html',
  styleUrls: ['./ventas-tabs.component.scss'],
  imports: [RouterModule, MatIcon, MatTooltip],
})
export default class VentasTabsComponent {
  private readonly dialog: DialogService = inject(DialogService);
  private readonly overlayService: OverlayService = inject(OverlayService);

  ventas: InputSignal<Venta[]> = input.required<Venta[]>();
  selected: InputSignal<number> = input.required<number>();
  cliente: InputSignal<Cliente | null> = input.required<Cliente | null>();
  showClose: InputSignal<boolean> = input<boolean>(false);
  closeTabEvent: OutputEmitterRef<number> = output<number>();
  newTabEvent: OutputEmitterRef<void> = output<void>();
  changeTabEvent: OutputEmitterRef<number> = output<number>();
  selectClientEvent: OutputEmitterRef<SelectClienteInterface | null> =
    output<SelectClienteInterface | null>();
  selectReservaEvent: OutputEmitterRef<Reserva[]> = output<Reserva[]>();

  selectClienteFrom: string | null = null;

  selectTab(ind: number): void {
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
    this.newTabEvent.emit();
  }

  selectClient(from: string | null = null): void {
    this.selectClienteFrom = from;
    const modalnewProveedorData: ElegirClienteModal = {
      modalTitle: 'Seleccionar cliente',
      modalColor: 'blue',
      from: from,
    };
    const dialog = this.overlayService.open<ElegirClienteModalResult>(
      ElegirClienteModalComponent,
      modalnewProveedorData,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null && data.data.cliente !== null) {
        const cliente: Cliente = data.data.cliente;
        this.selectClientEvent.emit({
          cliente: cliente,
          from: this.selectClienteFrom as string,
        });
      }
    });
  }

  removeClient(): void {
    this.selectClientEvent.emit(null);
  }

  showReservas(): void {
    const modalReservasData: Modal = {
      modalTitle: 'Reservas',
      modalColor: 'blue',
      css: 'modal-wide',
    };
    const dialog = this.overlayService.open<ReservasModalResult>(
      ReservasModalComponent,
      modalReservasData,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        const list: Reserva[] = data.data.list.filter(
          (x: Reserva | null): x is Reserva => x !== null,
        );
        this.selectReservaEvent.emit(list);
      }
    });
  }
}
