import { Component, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ImprentaComponent } from "src/app/modules/almacen/components/imprenta/imprenta.component";
import { MaterialModule } from "src/app/modules/material/material.module";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { AlmacenInventarioComponent } from "../../components/almacen-inventario/almacen-inventario.component";

@Component({
  standalone: true,
  selector: "otpv-almacen",
  templateUrl: "./almacen.component.html",
  styleUrls: ["./almacen.component.scss"],
  imports: [
    MaterialModule,
    ImprentaComponent,
    AlmacenInventarioComponent,
    HeaderComponent,
  ],
})
export class AlmacenComponent {
  @ViewChild("imprenta", { static: true }) imprenta: ImprentaComponent;

  constructor() {}

  tabChange(ev: MatTabChangeEvent): void {
    if (ev.index === 1) {
      this.imprenta.searchFocus();
    }
  }
}
