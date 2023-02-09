import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ArticuloBuscador } from "src/app/model/articulos/articulo-buscador.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-buscador-modal",
  templateUrl: "./buscador-modal.component.html",
  styleUrls: ["./buscador-modal.component.scss"],
})
export class BuscadorModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("searchBoxName", { static: true }) searchBoxName: ElementRef;
  searchName: string = "";
  searchTimer: number = null;
  searching: boolean = false;
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

  checkVisible(elm: HTMLElement): boolean {
    const rect: DOMRect = elm.getBoundingClientRect();
    const viewHeight: number = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  focusRow(): void {
    const element: HTMLElement = document.getElementById(
      "buscador-row-" +
        this.buscadorResultadosList[this.buscadorResultadosRow].localizador
    );
    if (!this.checkVisible(element)) {
      element.scrollIntoView();
    }
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
        this.focusRow();
      }
      if (ev.key === "ArrowDown") {
        if (
          this.buscadorResultadosRow ===
          this.buscadorResultadosList.length - 1
        ) {
          return;
        }
        this.buscadorResultadosRow++;
        this.focusRow();
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
        if (!this.searching) {
          this.buscadorStart();
        }
      }
    }
  }

  buscadorStart(): void {
    this.buscadorStop();
    this.searchTimer = window.setTimeout(() => {
      this.buscar();
    }, 300);
  }

  buscadorStop(): void {
    clearTimeout(this.searchTimer);
  }

  buscar(): void {
    this.buscadorStop();
    this.searching = true;
    this.vs.search(this.searchName).subscribe((result) => {
      this.searching = false;
      this.buscadorResultadosRow = 0;
      this.buscadorResultadosList = this.cms.getArticulosBuscador(result.list);
      this.buscadorResultadosDataSource.data = this.buscadorResultadosList;
    });
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.customOverlayRef.close(row.localizador);
  }

  ngOnDestroy(): void {
    this.buscadorStop();
  }
}
