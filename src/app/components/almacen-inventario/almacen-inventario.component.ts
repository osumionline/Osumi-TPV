import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { BuscadorAlmacenInterface } from "src/app/interfaces/almacen.interface";
import { InventarioItem } from "src/app/model/inventario-item.model";
import { AlmacenService } from "src/app/services/almacen.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
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
    num: 50,
  };
  list: InventarioItem[] = [];
  pags: number = 0;

  inventarioDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "referencia",
    "nombre",
    "stock",
    "pvp",
    "margen",
    "opciones",
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public ms: MarcasService,
    public ps: ProveedoresService,
    private as: AlmacenService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.as.getInventario(this.buscador).subscribe((result) => {
      this.list = this.cms.getInventarioItems(result.list);
      this.inventarioDataSource.data = this.list;
      this.pags = result.pags;
    });
  }

  ngAfterViewInit(): void {
    this.inventarioDataSource.sort = this.sort;
  }

  cambiarOrden(sort: Sort): void {
    if (sort.direction === "") {
      this.buscador.orderBy = null;
      this.buscador.orderSent = null;
    } else {
      this.buscador.orderBy = sort.active;
      this.buscador.orderSent = sort.direction;
    }
    this.buscar();
  }

  changePage(ev: PageEvent): void {
    this.buscador.pagina = ev.pageIndex + 1;
    this.buscador.num = ev.pageSize;
    this.buscar();
  }

  saveInventario(item: InventarioItem): void {
    this.as.saveInventario(item.toInterface()).subscribe((result) => {
      item._pvp = item.pvp;
      item._stock = item.stock;
    });
  }

  deleteInventario(item: InventarioItem): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estas seguro de querer borrar el artículo "' + item.nombre + '"?',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.as.deleteInventario(item.id).subscribe((result) => {
            const ind: number = this.list.findIndex(
              (x: InventarioItem): boolean => x.id === item.id
            );
            this.list.splice(ind, 1);
            this.inventarioDataSource.data = this.list;
          });
        }
      });
  }
}
