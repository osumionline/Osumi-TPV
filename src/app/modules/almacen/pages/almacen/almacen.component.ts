import { Component, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { ImprentaComponent } from "src/app/modules/almacen/components/imprenta/imprenta.component";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { AlmacenInventarioComponent } from "../../components/almacen-inventario/almacen-inventario.component";

@Component({
  standalone: true,
  selector: "otpv-almacen",
  templateUrl: "./almacen.component.html",
  styleUrls: ["./almacen.component.scss"],
  imports: [
    ImprentaComponent,
    AlmacenInventarioComponent,
    HeaderComponent,
    MatCardModule,
    MatTabsModule,
  ],
})
export default class AlmacenComponent {
  @ViewChild("imprenta", { static: true }) imprenta: ImprentaComponent;

  tabChange(ev: MatTabChangeEvent): void {
    if (ev.index === 1) {
      this.imprenta.searchFocus();
    }
  }
}
