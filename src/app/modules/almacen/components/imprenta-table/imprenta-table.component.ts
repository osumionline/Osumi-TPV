import { Component, OnInit } from "@angular/core";
import { QRCodeModule } from "angularx-qrcode";
import { ArticuloBuscador } from "src/app/model/articulos/articulo-buscador.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";

@Component({
  standalone: true,
  selector: "otpv-imprenta-table",
  templateUrl: "./imprenta-table.component.html",
  styleUrls: ["./imprenta-table.component.scss"],
  imports: [QRCodeModule, FixedNumberPipe],
})
export class ImprentaTableComponent implements OnInit {
  filas: number = 4;
  columnas: number = 5;
  list: ArticuloBuscador[][] = [];
  mostrarPVP: boolean = true;

  ngOnInit(): void {
    this.calcularLista();
  }

  calcularLista(
    filas: number = 4,
    columnas: number = 5,
    seleccionados: ArticuloBuscador[] = [],
    mostrarPVP: boolean = true
  ): void {
    this.filas = filas;
    this.columnas = columnas;
    this.mostrarPVP = mostrarPVP;

    let f_ind: number = 0;
    let c_ind: number = 0;
    this.list = [];

    for (const s of seleccionados) {
      for (let ind: number = 0; ind < s.num; ind++) {
        if (this.list[f_ind] === undefined) {
          this.list[f_ind] = [];
        }
        this.list[f_ind][c_ind] = new ArticuloBuscador().fromInterface(
          s.toInterface()
        );
        c_ind++;
        if (c_ind === columnas) {
          f_ind++;
          c_ind = 0;
        }
      }
    }

    for (let f: number = 0; f < filas; f++) {
      if (this.list[f] === undefined) {
        this.list[f] = [];
      }
      for (let c: number = 0; c < columnas; c++) {
        if (this.list[f][c] === undefined) {
          this.list[f][c] = null;
        }
      }
    }

    console.log(this.list);
  }
}
