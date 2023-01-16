import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  BuscadorAlmacenInterface,
  InventarioItemInterface,
} from "src/app/interfaces/almacen.interface";
import { InventarioItem } from "src/app/model/inventario-item.model";
import { AlmacenService } from "src/app/services/almacen.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { Utils } from "src/app/shared/utils.class";

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
  pageIndex: number = 0;

  inventarioDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "referencia",
    "nombre",
    "stock",
    "pvp",
    "margen",
    "codbarras",
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

  resetBuscar(): void {
    this.pageIndex = 0;
    this.buscador.pagina = 1;
    this.buscar();
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
    this.pageIndex = ev.pageIndex;
    this.buscador.pagina = ev.pageIndex + 1;
    this.buscador.num = ev.pageSize;
    this.buscar();
  }

  saveAll(): void {
    const list: InventarioItemInterface[] = [];
    for (let item of this.list) {
      if (item.pvpChanged || item.stockChanged || item.codigoBarras !== null) {
        list.push(item.toInterface());
      }
    }
    this.as.saveAllInventario(list).subscribe((result) => {
      const errorList: string[] = [];

      for (let status of result.list) {
        let ind: number = this.list.findIndex((x: InventarioItem): boolean => {
          return x.id === status.id;
        });
        if (status.status === "ok") {
          this.list[ind]._pvp = this.list[ind].pvp;
          this.list[ind]._stock = this.list[ind].stock;
          if (this.list[ind].codigoBarras !== null) {
            this.list[ind].hasCodigosBarras = true;
            this.list[ind].codigoBarras = null;
          }
        } else {
          errorList.push(
            "<strong>" +
              this.list[ind].nombre +
              "</strong>: " +
              Utils.urldecode(status.message)
          );
        }
      }
      if (errorList.length > 0) {
        this.dialog
          .alert({
            title: "Error",
            content:
              "Al realizar el guardado, han ocurrido los siguientes errores:<br><br>" +
              errorList.join("<br>"),
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }

  saveInventario(item: InventarioItem): void {
    this.as.saveInventario(item.toInterface()).subscribe((result) => {
      if (result.status === "ok") {
        item._pvp = item.pvp;
        item._stock = item.stock;
        if (item.codigoBarras !== null) {
          item.hasCodigosBarras = true;
          item.codigoBarras = null;
        }
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: Utils.urldecode(result.message),
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
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

  exportInventario(): void {
    this.as.exportInventario(this.buscador).subscribe((result) => {
      const data: Blob = new Blob([result], {
        type: "text/csv;charset=utf-8",
      });
      let url = window.URL.createObjectURL(data);
      let a: HTMLAnchorElement = document.createElement("a");
      a.href = url;
      a.download = "inventario.csv";
      a.click();
      a.remove();
    });
  }

  printInventario(): void {
    const data: string = btoa(JSON.stringify(this.buscador));
    window.open("inventario-print/" + data);
  }
}