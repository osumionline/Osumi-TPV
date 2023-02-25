import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { ElegirClienteModal, Modal } from "src/app/interfaces/modals.interface";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { Reserva } from "src/app/model/ventas/reserva.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ElegirClienteModalComponent } from "src/app/modules/ventas/components/modals/elegir-cliente-modal/elegir-cliente-modal.component";
import { ReservasModalComponent } from "src/app/modules/ventas/components/modals/reservas-modal/reservas-modal.component";
import { DialogService } from "src/app/services/dialog.service";
import { OverlayService } from "src/app/services/overlay.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-ventas-tabs",
  templateUrl: "./ventas-tabs.component.html",
  styleUrls: ["./ventas-tabs.component.scss"],
  imports: [CommonModule, RouterModule, MaterialModule],
})
export class VentasTabsComponent {
  @Input() showClose: boolean = false;
  @Output() closeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() newTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() changeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectClientEvent: EventEmitter<SelectClienteInterface> =
    new EventEmitter<SelectClienteInterface>();
  @Output() selectReservaEvent: EventEmitter<Reserva[]> = new EventEmitter<
    Reserva[]
  >();

  selectClienteFrom: string = null;

  constructor(
    private dialog: DialogService,
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
        this.selectReservaEvent.emit(data.data);
      }
    });
  }
}
