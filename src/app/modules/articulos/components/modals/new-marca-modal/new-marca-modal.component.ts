import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IdSaveResult } from "src/app/interfaces/interfaces";
import { Marca } from "src/app/model/marcas/marca.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";

@Component({
  standalone: true,
  selector: "otpv-new-marca-modal",
  templateUrl: "./new-marca-modal.component.html",
  styleUrls: ["./new-marca-modal.component.scss"],
  imports: [MaterialModule, FormsModule],
})
export class NewMarcaModalComponent implements OnInit {
  @ViewChild("nombreBox", { static: true }) nombreBox: ElementRef;
  marca: Marca = new Marca();

  constructor(
    private dialog: DialogService,
    private ms: MarcasService,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    this.nombreBox.nativeElement.focus();
  }

  guardarMarca(): void {
    if (!this.marca.nombre) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el nombre de la marca en blanco!",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
      return;
    }

    this.ms
      .saveMarca(this.marca.toInterface())
      .subscribe((result: IdSaveResult): void => {
        if (result.status === "ok") {
          this.ms.resetMarcas();
          this.customOverlayRef.close(result.id);
        }
        if (result.status === "error-nombre") {
          this.dialog
            .alert({
              title: "Error",
              content: "Ya existe una marca con el nombre indicado.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.nombreBox.nativeElement.focus();
            });
          return;
        }
        if (result.status === "error") {
          this.dialog
            .alert({
              title: "Error",
              content: "Ocurrió un error al guardar la nueva marca.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {});
          return;
        }
      });
  }
}