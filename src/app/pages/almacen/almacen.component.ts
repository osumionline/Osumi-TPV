import { Component, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ImprentaComponent } from "src/app/components/almacen/imprenta/imprenta.component";

@Component({
  selector: "otpv-almacen",
  templateUrl: "./almacen.component.html",
  styleUrls: ["./almacen.component.scss"],
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
