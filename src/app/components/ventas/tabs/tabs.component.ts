import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ElegirClienteModalComponent } from "src/app/components/modals/elegir-cliente-modal/elegir-cliente-modal.component";
import { ReservasModalComponent } from "src/app/components/modals/reservas-modal/reservas-modal.component";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { ElegirClienteModal, Modal } from "src/app/interfaces/modals.interface";
import { Cliente } from "src/app/model/cliente.model";
import { Reserva } from "src/app/model/reserva.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { DialogService } from "src/app/services/dialog.service";
import { OverlayService } from "src/app/services/overlay.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent {
  @Input() showClose: boolean = false;
  @Output() closeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() newTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() changeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectClientEvent: EventEmitter<SelectClienteInterface> =
    new EventEmitter<SelectClienteInterface>();
  @Output() selectReservaEvent: EventEmitter<Reserva> =
    new EventEmitter<Reserva>();

  selectClienteFrom: string = null;

  constructor(
    private dialog: DialogService,
    private cms: ClassMapperService,
    private cs: ClientesService,
    public vs: VentasService,
    private overlayService: OverlayService
  ) {}

  selectTab(ind: number): void {
    this.vs.selected = ind;
    this.changeTabEvent.emit(ind);
  }

  closeTab(ind: number): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer cerrar esta venta?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
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
      modalTitle: "Seleccionar cliente",
      modalColor: "blue",
      from: from,
    };
    const dialog = this.overlayService.open(
      ElegirClienteModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data) => {
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
      modalTitle: "Reservas",
      modalColor: "blue",
      css: "modal-wide",
    };
    const dialog = this.overlayService.open(
      ReservasModalComponent,
      modalReservasData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        const reserva: Reserva = data.data;
        this.selectReservaEvent.emit(reserva);
      }
    });
  }
}
