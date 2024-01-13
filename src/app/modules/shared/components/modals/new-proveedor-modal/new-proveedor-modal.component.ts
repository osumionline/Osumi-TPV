import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IdSaveResult } from "src/app/interfaces/interfaces";
import { MarcaInterface } from "src/app/interfaces/marca.interface";
import { Marca } from "src/app/model/marcas/marca.model";
import { Proveedor } from "src/app/model/proveedores/proveedor.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  standalone: true,
  selector: "otpv-new-proveedor-modal",
  templateUrl: "./new-proveedor-modal.component.html",
  styleUrls: ["./new-proveedor-modal.component.scss"],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class NewProveedorModalComponent implements OnInit {
  @ViewChild("nombreBox", { static: true }) nombreBox: ElementRef;
  proveedor: Proveedor = new Proveedor();
  marcasSelected: Marca[] = [];
  marcas: Marca[] = [];

  constructor(
    private ms: MarcasService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ps: ProveedoresService,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    this.marcas = this.cms.getMarcas(
      this.ms.marcas().map((m: Marca): MarcaInterface => {
        return m.toInterface();
      })
    );
    this.nombreBox.nativeElement.focus();
  }

  removeMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
    const ind: number = this.marcasSelected.findIndex(
      (x: Marca): boolean => x.id == marca.id
    );

    if (!ev.checked) {
      if (ind !== -1) {
        this.marcas.push(marca);
        this.marcasSelected.splice(ind, 1);
        this.sortMarcasLists();
      }
    }
  }

  addMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
    const ind: number = this.marcas.findIndex(
      (x: Marca): boolean => x.id == marca.id
    );
    if (ev.checked) {
      if (ind !== -1) {
        this.marcasSelected.push(marca);
        this.marcas.splice(ind, 1);
        this.sortMarcasLists();
      }
    }
  }

  sortMarcasLists(): void {
    this.marcasSelected.sort((a: Marca, b: Marca) =>
      a.nombre > b.nombre ? 1 : b.nombre > a.nombre ? -1 : 0
    );
    this.marcas.sort((a: Marca, b: Marca) =>
      a.nombre > b.nombre ? 1 : b.nombre > a.nombre ? -1 : 0
    );
  }

  guardarProveedor(): void {
    if (!this.proveedor.nombre) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el nombre del proveedor en blanco!",
          ok: "Continuar",
        })
        .subscribe(() => {
          setTimeout((): void => {
            this.nombreBox.nativeElement.focus();
          });
        });
      return;
    }

    if (this.marcasSelected.length == 0) {
      this.dialog
        .confirm({
          title: "Confirmar",
          content:
            "No has elegido ninguna marca para el proveedor, ¿quieres continuar?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.guardarProveedorMarcas();
          }
        });
      return;
    }

    this.guardarProveedorMarcas();
  }

  guardarProveedorMarcas(check: boolean = true): void {
    if (check) {
      let marcasCheck: boolean = true;
      for (const m of this.marcasSelected) {
        if (m.proveedor !== null && m.proveedor !== "") {
          marcasCheck = false;
          break;
        }
      }

      if (!marcasCheck) {
        this.dialog
          .confirm({
            title: "Confirmar",
            content:
              "Has elegido alguna marca que ya tenía asignado un proveedor, ¿quieres continuar? En caso de continuar será reemplazado y los artículos de dicha marca también cambiarán a este nuevo proveedor.",
            ok: "Continuar",
            cancel: "Cancelar",
          })
          .subscribe((result) => {
            if (result === true) {
              this.guardarProveedorMarcas(false);
            }
          });
        return;
      }
    }

    this.proveedor.marcas = this.marcasSelected.map((m: Marca): number => {
      return m.id;
    });
    this.guardarProveedorContinue();
  }

  guardarProveedorContinue(): void {
    this.ps
      .saveProveedor(this.proveedor.toInterface())
      .subscribe((result: IdSaveResult): void => {
        if (result.status === "ok") {
          this.ps.resetProveedores();
          this.customOverlayRef.close(result.id);
        }
        if (result.status === "error-nombre") {
          this.dialog.alert({
            title: "Error",
            content: "Ya existe un proveedor con el nombre indicado.",
            ok: "Continuar",
          });
          return;
        }
        if (result.status === "error") {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al guardar el nuevo proveedor.",
            ok: "Continuar",
          });
          return;
        }
      });
  }
}
