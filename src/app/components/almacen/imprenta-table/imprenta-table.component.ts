import { Component, Input } from "@angular/core";

@Component({
  selector: "otpv-imprenta-table",
  templateUrl: "./imprenta-table.component.html",
  styleUrls: ["./imprenta-table.component.scss"],
})
export class ImprentaTableComponent {
  @Input() filas: number = 4;
  @Input() columnas: number = 5;
  @Input() mostrarPVP: boolean = true;
}
