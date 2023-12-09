import { Component, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Params } from "@angular/router";
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
} from "src/app/interfaces/almacen.interface";
import { InventarioItem } from "src/app/model/almacen/inventario-item.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { AlmacenService } from "src/app/services/almacen.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";

@Component({
  standalone: true,
  selector: "otpv-inventario-print",
  templateUrl: "./inventario-print.component.html",
  styleUrls: ["./inventario-print.component.scss"],
  imports: [FixedNumberPipe, MatTableModule],
})
export default class InventarioPrintComponent implements OnInit {
  buscador: BuscadorAlmacenInterface = null;
  list: InventarioItem[] = [];
  inventarioDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "referencia",
    "nombre",
    "stock",
    "pvp",
    "margen",
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private as: AlmacenService,
    private cms: ClassMapperService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const data: string = params.data;
      try {
        const objStr: string = window.atob(data);
        this.buscador = JSON.parse(objStr);
      } catch (error) {
        this.buscador = null;
      }
      if (this.buscador === null) {
        alert("¡Ocurrió un error al obtener los datos!");
      } else {
        this.load();
      }
    });
  }

  load(): void {
    this.buscador.num = null;
    this.as
      .getInventario(this.buscador)
      .subscribe((result: BuscadorAlmacenResult): void => {
        this.list = this.cms.getInventarioItems(result.list);
        this.inventarioDataSource.data = this.list;

        setTimeout((): void => {
          window.print();
        });
      });
  }
}
