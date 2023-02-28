import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ArticuloBuscadorResult } from "src/app/interfaces/articulo.interface";
import { ArticuloBuscador } from "src/app/model/articulos/articulo-buscador.model";
import { ImprentaTableComponent } from "src/app/modules/almacen/components/imprenta-table/imprenta-table.component";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

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
  @ViewChild("tabla", { static: true }) tabla: ImprentaTableComponent;
  seleccionados: ArticuloBuscador[] = [];
  filas: number = 4;
  columnas: number = 5;
  mostrarPVP: boolean = true;

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  searchFocus(): void {
    setTimeout((): void => {
      this.searchBox.nativeElement.focus();
    }, 100);
  }

  buscadorStart(): void {
    this.buscadorStop();
    this.searchTimer = window.setTimeout((): void => {
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
    this.vs
      .search(this.search)
      .subscribe((result: ArticuloBuscadorResult): void => {
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
    this.updateTable();
  }

  addHueco(): void {
    const maxInd: number = this.seleccionados.length - 1;
    if (
      this.seleccionados[maxInd] !== undefined &&
      this.seleccionados[maxInd].localizador === null
    ) {
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
    this.updateTable();
  }

  deleteLinea(ind: number): void {
    this.seleccionados.splice(ind, 1);
    this.updateTable();
  }

  addLineaNum(ind: number, amount: number): void {
    const cantidadTotal: number = this.getCantidadTotal();
    const cantidadMax: number = this.getCantidadMax();

    if (amount === -1) {
      if (this.seleccionados[ind].num === 1) {
        return;
      }
      this.seleccionados[ind].num--;
      this.updateTable();
    } else {
      if (this.checkCantidad(cantidadTotal + 1)) {
        this.seleccionados[ind].num++;
        this.updateTable();
      }
    }
  }

  updateTable(): void {
    this.tabla.calcularLista(
      this.filas,
      this.columnas,
      this.seleccionados,
      this.mostrarPVP
    );
  }

  checkCantidad(num: number): boolean {
    const cantidadMax: number = this.getCantidadMax();

    if (num > this.getCantidadMax()) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "El número máximo de etiquetas que puedes imprimir es " +
            cantidadMax,
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
      return false;
    }
    return true;
  }

  getCantidadTotal(): number {
    return this.seleccionados.reduce(
      (total: number, item: ArticuloBuscador): number => total + item.num,
      0
    );
  }

  getCantidadMax(): number {
    return this.filas * this.columnas;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.seleccionados,
      event.previousIndex,
      event.currentIndex
    );
    this.updateTable();
  }
}
