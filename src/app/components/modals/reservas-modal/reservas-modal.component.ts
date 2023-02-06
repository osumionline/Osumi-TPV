import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";
import { ReservaLinea } from "src/app/model/reserva-linea.model";
import { Reserva } from "src/app/model/reserva.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "otpv-reservas-modal",
  templateUrl: "./reservas-modal.component.html",
  styleUrls: ["./reservas-modal.component.scss"],
})
export class ReservasModalComponent implements OnInit, AfterViewInit {
  list: Reserva[] = [];
  reservaSelected: Reserva = null;

  reservasDisplayedColumns: string[] = ["fecha", "cliente", "importe"];
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
    this.customOverlayRef.close(this.reservaSelected);
  }
}
