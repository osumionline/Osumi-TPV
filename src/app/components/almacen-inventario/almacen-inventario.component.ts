import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { BuscadorAlmacenInterface } from "src/app/interfaces/almacen.interface";
import { InventarioItem } from "src/app/model/inventario-item.model";
import { AlmacenService } from "src/app/services/almacen.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-almacen-inventario",
  templateUrl: "./almacen-inventario.component.html",
  styleUrls: ["./almacen-inventario.component.scss"],
})
export class AlmacenInventarioComponent implements OnInit, AfterViewInit {
  buscador: BuscadorAlmacenInterface = {
    idProveedor: null,
    idMarca: null,
    nombre: null,
    orderBy: null,
    orderSent: null,
    pagina: 1,
  };
  list: InventarioItem[] = [];
  pags: number = 0;

  inventarioDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "referencia",
    "descripcion",
    "stock",
    "pvp",
    "margen",
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public ms: MarcasService,
    public ps: ProveedoresService,
    private as: AlmacenService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.as.getInventario(this.buscador).subscribe((result) => {
      this.list = this.cms.getInventarioItems(result.list);
      this.inventarioDataSource.data = this.list;
      this.pags = result.pags;

      console.log(this.list);
    });
  }

  ngAfterViewInit(): void {
    this.inventarioDataSource.sort = this.sort;
  }

  cambiarOrden(sort: Sort): void {
    console.log(sort);
  }

  changePage(ev: PageEvent): void {
    this.buscador.pagina = ev.pageIndex + 1;
    this.buscar();
  }
}
