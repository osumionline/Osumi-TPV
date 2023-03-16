import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { ReservaLinea } from "src/app/model/ventas/reserva-linea.model";
import { Reserva } from "src/app/model/ventas/reserva.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-reservas-modal",
  templateUrl: "./reservas-modal.component.html",
  styleUrls: ["./reservas-modal.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    FixedNumberPipe,
  ],
})
export class ReservasModalComponent implements OnInit, AfterViewInit {
  list: Reserva[] = [];
  reservaSelected: Reserva = null;

  reservasDisplayedColumns: string[] = [
    "select",
    "fecha",
    "cliente",
    "importe",
  ];
  reservasDataSource: MatTableDataSource<Reserva> =
    new MatTableDataSource<Reserva>();
  reservaSelectedDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "articulo",
    "unidades",
    "pvp",
    "descuento",
    "importe",
  ];
  reservaSelectedDataSource: MatTableDataSource<ReservaLinea> =
    new MatTableDataSource<ReservaLinea>();
  @ViewChild(MatSort) sort: MatSort;

  selection: SelectionModel<Reserva> = new SelectionModel<Reserva>(true, []);

  constructor(
    private cs: ClientesService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.cs.getReservas().subscribe((result) => {
      this.list = this.cms.getReservas(result.list);
      this.reservasDataSource.data = this.list;
    });
  }

  ngAfterViewInit(): void {
    this.reservasDataSource.sort = this.sort;
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.reservasDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.reservasDataSource.data.forEach((row) =>
          this.selection.select(row)
        );
  }

  selectReserva(ind: number): void {
    this.reservaSelected = this.list[ind];
    this.reservaSelectedDataSource.data = this.reservaSelected.lineas;
  }

  deleteReserva(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer borrar esta reserva?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteVenta();
        }
      });
  }

  confirmDeleteVenta(): void {
    this.cs.deleteReserva(this.reservaSelected.id).subscribe((result) => {
      if (result.status === "ok") {
        this.reservaSelected = null;
        this.loadReservas();
      }
    });
  }

  cargarVenta(): void {
    this.customOverlayRef.close([this.reservaSelected]);
  }

  cargarVentas(): void {
    let idCliente: number = null;
    for (let reserva of this.selection.selected) {
      if (idCliente === null) {
        idCliente = reserva.idCliente;
      }
      if (idCliente !== reserva.idCliente) {
        this.dialog
          .alert({
            title: "Error",
            content: "Las reservas elegidas pertenecen a distintos clientes.",
            ok: "Continuar",
          })
          .subscribe((result) => {});
        return;
      }
    }
    this.customOverlayRef.close(this.selection.selected);
  }
}
