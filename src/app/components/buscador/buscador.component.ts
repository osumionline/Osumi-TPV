import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-buscador",
  templateUrl: "./buscador.component.html",
  styleUrls: ["./buscador.component.scss"],
})
export class BuscadorComponent implements AfterViewInit {
  muestraBuscador: boolean = false;
  @ViewChild("searchBoxName", { static: true }) searchBoxName: ElementRef;
  searchName: string = "";
  buscadorResultadosList: ArticuloBuscador[] = [];
  buscadorResultadosRow: number = 0;
  buscadorResultadosDisplayedColumns: string[] = [
    "nombre",
    "marca",
    "pvp",
    "stock",
  ];
  buscadorResultadosDataSource: MatTableDataSource<ArticuloBuscador> =
    new MatTableDataSource<ArticuloBuscador>();
  @ViewChild(MatSort) sort: MatSort;

  @Output() closeEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private vs: VentasService, private cms: ClassMapperService) {}

  ngAfterViewInit(): void {
    this.buscadorResultadosDataSource.sort = this.sort;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.muestraBuscador) {
        this.cerrarBuscador();
      }
    }
  }

  abreBuscador(key: string): void {
    this.muestraBuscador = true;
    this.searchName = key;
    this.buscadorResultadosRow = 0;
    setTimeout(() => {
      this.searchBoxName.nativeElement.focus();
    }, 0);
    this.searchStart();
  }

  cerrarBuscador(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraBuscador = false;
    this.closeEvent.emit(null);
  }

  checkSearchKeys(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter")
    ) {
      ev.preventDefault();
      if (ev.key === "ArrowUp") {
        if (this.buscadorResultadosRow === 0) {
          return;
        }
        this.buscadorResultadosRow--;
      }
      if (ev.key === "ArrowDown") {
        if (this.buscadorResultadosRow === this.buscadorResultadosList.length) {
          return;
        }
        this.buscadorResultadosRow++;
      }
      if (ev.key === "Enter") {
        this.selectBuscadorResultadosRow(
          this.buscadorResultadosList[this.buscadorResultadosRow]
        );
      }
    }
  }

  searchStart(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter")
    ) {
      ev.preventDefault();
    } else {
      if (this.searchName === "") {
        this.buscadorResultadosList = [];
        this.buscadorResultadosRow = 0;
      } else {
        this.vs.search(this.searchName).subscribe((result) => {
          this.buscadorResultadosList = this.cms.getArticulosBuscador(
            result.list
          );
          this.buscadorResultadosDataSource.data = this.buscadorResultadosList;
        });
      }
    }
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.muestraBuscador = false;
    this.closeEvent.emit(row.localizador);
  }
}
