import { Component, OnInit, WritableSignal, signal } from "@angular/core";
import { ArticuloBuscador } from "@model/articulos/articulo-buscador.model";
import { FixedNumberPipe } from "@shared/pipes/fixed-number.pipe";
import { QRCodeModule } from "angularx-qrcode";

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
  list: WritableSignal<ArticuloBuscador[][]> = signal<ArticuloBuscador[][]>([]);
  mostrarPVP: WritableSignal<boolean> = signal<boolean>(true);

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
    this.mostrarPVP.set(mostrarPVP);

    let f_ind: number = 0;
    let c_ind: number = 0;
    const list: ArticuloBuscador[][] = [];

    for (const s of seleccionados) {
      for (let ind: number = 0; ind < s.num; ind++) {
        if (list[f_ind] === undefined) {
          list[f_ind] = [];
        }
        list[f_ind][c_ind] = new ArticuloBuscador().fromInterface(
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
      if (list[f] === undefined) {
        list[f] = [];
      }
      for (let c: number = 0; c < columnas; c++) {
        if (list[f][c] === undefined) {
          list[f][c] = null;
        }
      }
    }
    this.list.set(list);
  }
}
