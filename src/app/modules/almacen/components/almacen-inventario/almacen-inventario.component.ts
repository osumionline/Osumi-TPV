import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  BuscadorAlmacenInterface,
  InventarioItemInterface,
} from "src/app/interfaces/almacen.interface";
import { InventarioItem } from "src/app/model/almacen/inventario-item.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { CustomPaginatorIntl } from "src/app/modules/shared/custom-paginator-intl.class";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { Utils } from "src/app/modules/shared/utils.class";
import { AlmacenService } from "src/app/services/almacen.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  standalone: true,
  selector: "otpv-almacen-inventario",
  templateUrl: "./almacen-inventario.component.html",
  styleUrls: ["./almacen-inventario.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
  ],
})
export class AlmacenInventarioComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
    "proveedor",
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
    private ars: ArticulosService,
    public ms: MarcasService,
    public ps: ProveedoresService,
    private as: AlmacenService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ars.returnInfo = null;
    if (!this.as.firstLoad) {
      this.buscador = this.as.buscador;
      this.list = this.as.list;
      this.inventarioDataSource.data = this.list;
      this.pageIndex = this.as.pageIndex;
      this.pags = this.as.pags;
    } else {
      this.buscar();
    }
  }

  buscar(): void {
    this.as.getInventario(this.buscador).subscribe((result) => {
      this.list = this.cms.getInventarioItems(result.list);
      this.inventarioDataSource.data = this.list;
      this.pags = result.pags;

      this.as.buscador = this.buscador;
      this.as.list = this.list;
      this.as.pags = this.pags;
      this.as.pageIndex = this.pageIndex;
      this.as.firstLoad = false;
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
      let url: string = window.URL.createObjectURL(data);
      let a: HTMLAnchorElement = document.createElement("a");
      a.href = url;
      a.download = "inventario.csv";
      a.click();
      a.remove();
    });
  }

  printInventario(): void {
    const data: string = btoa(JSON.stringify(this.buscador));
    window.open("/almacen/inventario-print/" + data);
  }

  goToArticulo(ev: MouseEvent, item: InventarioItem): void {
    ev && ev.preventDefault();
    this.ars.returnInfo = {
      where: "almacen",
      id: null,
      extra: null,
    };
    this.router.navigate(["/articulos", item.localizador]);
  }

  ngOnDestroy(): void {
    this.as.buscador = this.buscador;
    this.as.list = this.list;
    this.as.pags = this.pags;
    this.as.pageIndex = this.pageIndex;
    this.as.firstLoad = false;
  }
}
