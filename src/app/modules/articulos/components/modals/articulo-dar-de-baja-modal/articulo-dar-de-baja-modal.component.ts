import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { StatusResult } from "src/app/interfaces/interfaces";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-articulo-dar-de-baja-modal",
  templateUrl: "./articulo-dar-de-baja-modal.component.html",
  styleUrls: ["./articulo-dar-de-baja-modal.component.scss"],
  imports: [MatButtonModule],
})
export class ArticuloDarDeBajaModalComponent implements OnInit {
  id: number;
  nombre: string = null;
  darDeBajaLoading: boolean = false;

  constructor(
    private dialog: DialogService,
    private ars: ArticulosService,
    private customOverlayRef: CustomOverlayRef<
      null,
      { id: number; nombre: string }
    >
  ) {}

  ngOnInit(): void {
    this.id = this.customOverlayRef.data.id;
    this.nombre = this.customOverlayRef.data.nombre;
  }

  darDeBajaOk(): void {
    this.darDeBajaLoading = true;
    this.ars
      .deleteArticulo(this.id)
      .subscribe((response: StatusResult): void => {
        if (response.status == "ok") {
          this.dialog
            .alert({
              title: "Éxito",
              content:
                'El artículo "' + this.nombre + '" ha sido dado de baja.',
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.customOverlayRef.close(true);
            });
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "¡Ocurrió un error al dar de baja el artículo!",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.darDeBajaLoading = false;
            });
        }
      });
  }
}
