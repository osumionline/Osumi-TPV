import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioItemInterface,
} from "@interfaces/almacen.interface";
import {
  StatusIdMessageErrorsResult,
  StatusIdMessageResult,
  StatusResult,
} from "@interfaces/interfaces";
import { InventarioItem } from "@model/almacen/inventario-item.model";
import { urldecode } from "@osumi/tools";
import { AlmacenService } from "@services/almacen.service";
import { ArticulosService } from "@services/articulos.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { DialogService } from "@services/dialog.service";
import { MarcasService } from "@services/marcas.service";
import { ProveedoresService } from "@services/proveedores.service";
import { CustomPaginatorIntl } from "@shared/custom-paginator-intl.class";
import { FixedNumberPipe } from "@shared/pipes/fixed-number.pipe";

@Component({
  standalone: true,
  selector: "otpv-almacen-inventario",
  templateUrl: "./almacen-inventario.component.html",
  styleUrls: ["./almacen-inventario.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    NgClass,
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    MatSelect,
    MatOption,
    MatIcon,
    MatTableModule,
    MatTooltip,
    MatPaginatorModule,
    MatSlideToggle,
  ],
})
export class AlmacenInventarioComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private ars: ArticulosService = inject(ArticulosService);
  public ms: MarcasService = inject(MarcasService);
  public ps: ProveedoresService = inject(ProveedoresService);
  private as: AlmacenService = inject(AlmacenService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private router: Router = inject(Router);

  buscador: WritableSignal<BuscadorAlmacenInterface> = signal({
    idProveedor: null,
    idMarca: null,
    nombre: null,
    descuento: false,
    orderBy: null,
    orderSent: null,
    pagina: 1,
    num: 50,
  });
  list: WritableSignal<InventarioItem[]> = signal<InventarioItem[]>([]);
  pags: WritableSignal<number> = signal<number>(0);
  pageIndex: WritableSignal<number> = signal<number>(0);
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

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
  sort: Signal<MatSort> = viewChild(MatSort);

  ngOnInit(): void {
    this.ars.returnInfo = null;
    if (!this.as.firstLoad) {
      this.buscador.set(this.as.buscador);
      this.list.set(this.as.list);
      this.inventarioDataSource.data = this.list();
      this.pageIndex.set(this.as.pageIndex);
      this.pags.set(this.as.pags);
    } else {
      this.buscar();
    }
  }

  buscar(): void {
    this.as
      .getInventario(this.buscador())
      .subscribe((result: BuscadorAlmacenResult): void => {
        this.list.set(this.cms.getInventarioItems(result.list));
        this.inventarioDataSource.data = this.list();
        this.pags.set(result.pags);
        this.totalPVP.set(result.totalPVP);
        this.totalPUC.set(result.totalPUC);

        this.as.buscador = this.buscador();
        this.as.list = this.list();
        this.as.pags = this.pags();
        this.as.pageIndex = this.pageIndex();
        this.as.firstLoad = false;
      });
  }

  ngAfterViewInit(): void {
    this.inventarioDataSource.sort = this.sort();
  }

  resetBuscar(): void {
    this.pageIndex.set(0);
    this.buscador.update(
      (value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
        value.pagina = 1;
        return value;
      }
    );
    this.buscar();
  }

  cambiarOrden(sort: Sort): void {
    if (sort.direction === "") {
      this.buscador.update(
        (value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
          value.orderBy = null;
          value.orderSent = null;
          return value;
        }
      );
    } else {
      this.buscador.update(
        (value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
          value.orderBy = sort.active;
          value.orderSent = sort.direction;
          return value;
        }
      );
    }
    this.buscar();
  }

  changePage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.buscador.update(
      (value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
        value.pagina = ev.pageIndex + 1;
        value.num = ev.pageSize;
        return value;
      }
    );
    this.buscar();
  }

  saveAll(): void {
    const list: InventarioItemInterface[] = [];
    for (const item of this.list()) {
      if (item.pvpChanged || item.stockChanged || item.codigoBarras !== null) {
        list.push(item.toInterface());
      }
    }
    this.as
      .saveAllInventario(list)
      .subscribe((result: StatusIdMessageErrorsResult): void => {
        const errorList: string[] = [];

        for (const status of result.list) {
          const ind: number = this.list().findIndex(
            (x: InventarioItem): boolean => {
              return x.id === status.id;
            }
          );
          if (status.status === "ok") {
            this.list.update((value: InventarioItem[]): InventarioItem[] => {
              value[ind]._pvp = value[ind].pvp;
              value[ind]._stock = value[ind].stock;
              if (value[ind].codigoBarras !== null) {
                value[ind].hasCodigosBarras = true;
                value[ind].codigoBarras = null;
              }
              return value;
            });
          } else {
            errorList.push(
              "<strong>" +
                this.list()[ind].nombre +
                "</strong>: " +
                urldecode(status.message)
            );
          }
        }
        if (errorList.length > 0) {
          this.dialog.alert({
            title: "Error",
            content:
              "Al realizar el guardado, han ocurrido los siguientes errores:<br><br>" +
              errorList.join("<br>"),
            ok: "Continuar",
          });
        }
      });
  }

  saveInventario(item: InventarioItem): void {
    this.as
      .saveInventario(item.toInterface())
      .subscribe((result: StatusIdMessageResult): void => {
        if (result.status === "ok") {
          item._pvp = item.pvp;
          item._stock = item.stock;
          if (item.codigoBarras !== null) {
            item.hasCodigosBarras = true;
            item.codigoBarras = null;
          }
        } else {
          this.dialog.alert({
            title: "Error",
            content: urldecode(result.message),
            ok: "Continuar",
          });
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
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.as
            .deleteInventario(item.id)
            .subscribe((result: StatusResult): void => {
              if (result.status === "ok") {
                const ind: number = this.list().findIndex(
                  (x: InventarioItem): boolean => x.id === item.id
                );
                this.list.update(
                  (value: InventarioItem[]): InventarioItem[] => {
                    value.splice(ind, 1);
                    return value;
                  }
                );
                this.inventarioDataSource.data = this.list();
              } else {
                this.dialog.alert({
                  title: "Error",
                  content: "Ocurrió un error al borrar el artículo.",
                  ok: "Continuar",
                });
              }
            });
        }
      });
  }

  exportInventario(): void {
    this.as.exportInventario(this.buscador()).subscribe((result): void => {
      const data: Blob = new Blob([result], {
        type: "text/csv;charset=utf-8",
      });
      const url: string = window.URL.createObjectURL(data);
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = url;
      a.download = "inventario.csv";
      a.click();
      a.remove();
    });
  }

  printInventario(): void {
    const data: string = window.btoa(JSON.stringify(this.buscador()));
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
    this.as.buscador = this.buscador();
    this.as.list = this.list();
    this.as.pags = this.pags();
    this.as.pageIndex = this.pageIndex();
    this.as.firstLoad = false;
  }
}
