import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ArticuloBuscador } from "src/app/model/articulos/articulo-buscador.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { VentasService } from "src/app/services/ventas.service";
import { ImprentaTableComponent } from "../imprenta-table/imprenta-table.component";

@Component({
  standalone: true,
  selector: "otpv-imprenta",
  templateUrl: "./imprenta.component.html",
  styleUrls: ["./imprenta.component.scss"],
  imports: [CommonModule, MaterialModule, FormsModule, ImprentaTableComponent],
})
export class ImprentaComponent {
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  search: string = "";
  searchTimer: number = null;
  searching: boolean = false;
  articulos: ArticuloBuscador[] = [];
  seleccionados: ArticuloBuscador[] = [];
  filas: number = 4;
  columnas: number = 5;
  mostrarPVP: boolean = true;

  constructor(private vs: VentasService, private cms: ClassMapperService) {}

  searchFocus(): void {
    setTimeout(() => {
      this.searchBox.nativeElement.focus();
    }, 100);
  }

  buscadorStart(): void {
    this.buscadorStop();
    this.searchTimer = window.setTimeout(() => {
      this.buscar();
    }, 300);
  }

  searchStart(ev: KeyboardEvent = null): void {
    if (this.search === "") {
      this.articulos = [];
    } else {
      if (!this.searching) {
        this.buscadorStart();
      }
    }
  }

  buscadorStop(): void {
    clearTimeout(this.searchTimer);
  }

  buscar(): void {
    this.buscadorStop();
    this.searching = true;
    this.vs.search(this.search).subscribe((result) => {
      this.searching = false;
      this.articulos = this.cms.getArticulosBuscador(result.list);
    });
  }

  selectArticulo(articulo: ArticuloBuscador): void {
    const ind: number = this.seleccionados.findIndex(
      (x: ArticuloBuscador): boolean => {
        return x.localizador === articulo.localizador;
      }
    );
    if (ind === -1) {
      articulo.num = 1;
      this.seleccionados.push(articulo);
    } else {
      this.seleccionados[ind].num++;
    }
  }

  addHueco(): void {
    const maxInd: number = this.seleccionados.length - 1;
    if (this.seleccionados[maxInd].localizador === null) {
      this.seleccionados[maxInd].num++;
    } else {
      const hueco: ArticuloBuscador = new ArticuloBuscador();
      hueco.nombre = "Hueco";
      hueco.marca = "Hueco en blanco";
      hueco.localizador = null;
      hueco.num = 1;
      hueco.pvp = null;
      this.seleccionados.push(hueco);
    }
  }

  deleteLinea(ind: number): void {
    this.seleccionados.splice(ind, 1);
  }

  addLineaNum(ind: number, amount: number): void {
    if (amount === -1) {
      if (this.seleccionados[ind].num === 1) {
        return;
      }
      this.seleccionados[ind].num--;
    } else {
      this.seleccionados[ind].num++;
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.seleccionados,
      event.previousIndex,
      event.currentIndex
    );
  }
}
