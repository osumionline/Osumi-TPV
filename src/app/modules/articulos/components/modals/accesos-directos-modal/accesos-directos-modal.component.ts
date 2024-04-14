import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AccesoDirectoResult } from "@app/interfaces/articulo.interface";
import { StatusResult } from "@interfaces/interfaces";
import { AccesoDirecto } from "@model/articulos/acceso-directo.model";
import { CustomOverlayRef } from "@model/tpv/custom-overlay-ref.model";
import { ArticulosService } from "@services/articulos.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { DialogService } from "@services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-accesos-directos-modal",
  templateUrl: "./accesos-directos-modal.component.html",
  styleUrls: ["./accesos-directos-modal.component.scss"],
  imports: [
    NgClass,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatInput,
  ],
})
export class AccesosDirectosModalComponent implements OnInit, AfterViewInit {
  private dialog: DialogService = inject(DialogService);
  private ars: ArticulosService = inject(ArticulosService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private customOverlayRef: CustomOverlayRef<null, { idArticulo: number }> =
    inject(CustomOverlayRef<null, { idArticulo: number }>);

  idArticulo: WritableSignal<number | null> = signal<number | null>(null);
  accesosDirectosList: AccesoDirecto[] = [];
  accesoDirecto: WritableSignal<number | null> = signal<number | null>(null);
  accesosDirectosDisplayedColumns: string[] = ["accesoDirecto", "nombre", "id"];
  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();
  sort: Signal<MatSort> = viewChild(MatSort);

  acccesoDirectoBox: Signal<ElementRef> = viewChild("acccesoDirectoBox");

  ngOnInit(): void {
    this.idArticulo.set(this.customOverlayRef.data.idArticulo);
    this.load();
  }

  ngAfterViewInit(): void {
    this.accesosDirectosDataSource.sort = this.sort();
  }

  load(): void {
    this.ars
      .getAccesosDirectosList()
      .subscribe((result: AccesoDirectoResult): void => {
        this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
        this.accesosDirectosDataSource.data = this.accesosDirectosList;
        this.accesoDirecto = null;
        window.setTimeout((): void => {
          this.acccesoDirectoBox().nativeElement.focus();
        }, 0);
      });
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.customOverlayRef.close(row.accesoDirecto);
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
    this.ars.deleteAccesoDirecto(id).subscribe((result: StatusResult): void => {
      if (result.status === "ok") {
        this.load();
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al borrar el acceso directo.",
          ok: "Continuar",
        });
      }
    });
  }

  asignarAccesoDirecto(): void {
    const ind: number = this.accesosDirectosList.findIndex(
      (x: AccesoDirecto): boolean => x.accesoDirecto === this.accesoDirecto()
    );
    if (ind != -1) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "El acceso directo que estás intentando asignar ya está en uso.",
          ok: "Continuar",
        })
        .subscribe((): void => {
          window.setTimeout((): void => {
            this.acccesoDirectoBox().nativeElement.focus();
          }, 0);
        });
      return;
    }

    this.ars
      .asignarAccesoDirecto(this.idArticulo(), this.accesoDirecto())
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.dialog
            .alert({
              title: "OK",
              content: "El acceso directo ha sido asignado.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.load();
            });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al asignar el acceso directo.",
            ok: "Continuar",
          });
        }
      });
  }
}
