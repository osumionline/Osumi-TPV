import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "otpv-accesos-directos",
  templateUrl: "./accesos-directos.component.html",
  styleUrls: ["./accesos-directos.component.scss"],
})
export class AccesosDirectosComponent {
  accesosDirectosList: AccesoDirecto[] = [];
  accesoDirecto: number = null;
  accesosDirectosDisplayedColumns: string[] = ["accesoDirecto", "nombre", "id"];
  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("acccesoDirectoBox", { static: true })
  acccesoDirectoBox: ElementRef;

  constructor(private dialog: DialogService, private ars: ArticulosService) {}

  abrirAccesosDirectos(): void {
    this.ars.getAccesosDirectosList().subscribe((result) => {
      this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
      this.accesosDirectosDataSource.data = this.accesosDirectosList;
      this.accesoDirecto = null;
      setTimeout(() => {
        this.acccesoDirectoBox.nativeElement.focus();
      }, 0);
    });
  }

  accesosDirectosCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    //this.showAccesosDirectos = false;
    setTimeout(() => {
      this.localizadorBox.nativeElement.focus();
    }, 0);
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.form.get("localizador").setValue(row.id);
    this.loadArticulo();
    this.accesosDirectosCerrar();
  }

  borrarAccesoDirecto(ev: MouseEvent, id: number): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer borrar este acceso directo?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.borrarAccesoDirectoConfirm(id);
        }
      });
  }

  borrarAccesoDirectoConfirm(id: number): void {
    this.ars.deleteAccesoDirecto(id).subscribe((result) => {
      this.abrirAccesosDirectos();
    });
  }

  asignarAccesoDirecto(): void {
    const ind: number = this.accesosDirectosList.findIndex(
      (x: AccesoDirecto): boolean => x.accesoDirecto === this.accesoDirecto
    );
    if (ind != -1) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "El acceso directo que estás intentando asignar ya está en uso.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.acccesoDirectoBox.nativeElement.focus();
          }, 0);
        });
      return;
    }

    this.ars
      .asignarAccesoDirecto(this.articulo.id, this.accesoDirecto)
      .subscribe((result) => {
        this.dialog
          .alert({
            title: "OK",
            content: "El acceso directo ha sido asignado.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.abrirAccesosDirectos();
          });
      });
  }
}
