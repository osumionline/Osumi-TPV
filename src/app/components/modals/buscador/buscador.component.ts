import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-buscador",
  templateUrl: "./buscador.component.html",
  styleUrls: ["./buscador.component.scss"],
})
export class BuscadorComponent implements OnInit, AfterViewInit {
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

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    private customOverlayRef: CustomOverlayRef<null, { key: string }>
  ) {}

  ngOnInit(): void {
    this.searchName = this.customOverlayRef.data.key;
    this.buscadorResultadosRow = 0;
    setTimeout(() => {
      this.searchBoxName.nativeElement.focus();
    }, 0);
    this.searchStart();
  }

  ngAfterViewInit(): void {
    this.buscadorResultadosDataSource.sort = this.sort;
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
    this.customOverlayRef.close(row.localizador);
  }
}
