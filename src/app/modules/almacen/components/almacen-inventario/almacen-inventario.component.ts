import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioColumn,
  InventarioItemInterface,
} from '@interfaces/almacen.interface';
import {
  StatusIdMessageErrorsResult,
  StatusIdMessageResult,
  StatusResult,
} from '@interfaces/interfaces';
import InventarioItem from '@model/almacen/inventario-item.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import Marca from '@model/marcas/marca.model';
import Proveedor from '@model/proveedores/proveedor.model';
import { DialogService } from '@osumi/angular-tools';
import { urldecode } from '@osumi/tools';
import AlmacenService from '@services/almacen.service';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import CustomPaginatorIntl from '@shared/custom-paginator-intl.class';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-almacen-inventario',
  templateUrl: './almacen-inventario.component.html',
  styleUrls: ['./almacen-inventario.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatFormFieldModule,
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
export default class AlmacenInventarioComponent implements OnInit, OnDestroy {
  private readonly ars: ArticulosService = inject(ArticulosService);
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly ps: ProveedoresService = inject(ProveedoresService);
  private readonly as: AlmacenService = inject(AlmacenService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);

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
  mediaMargen: WritableSignal<number> = signal<number>(0);
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

  marcas: Marca[] = this.ms.marcas();
  proveedores: Proveedor[] = this.ps.proveedores();

  columns: InventarioColumn[] = [
    { value: 'localizador', name: 'Localizador' },
    { value: 'proveedor', name: 'Proveedor' },
    { value: 'marca', name: 'Marca' },
    { value: 'referencia', name: 'Referencia' },
    { value: 'nombre', name: 'Nombre' },
    { value: 'stock', name: 'Stock' },
    { value: 'puc', name: 'PUC' },
    { value: 'palb', name: 'Precio albarán' },
    { value: 'pvp', name: 'PVP' },
    { value: 'margen', name: 'Margen' },
    { value: 'codbarras', name: 'Código de barras' },
    { value: 'opciones', name: 'Opciones' },
  ];
  inventarioDisplayedColumns: string[] = [
    'localizador',
    'proveedor',
    'marca',
    'referencia',
    'nombre',
    'stock',
    'puc',
    'pvp',
    'margen',
    'codbarras',
    'opciones',
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.ars.returnInfo = null;
    if (!this.as.firstLoad) {
      this.buscador.set(this.as.buscador);
      this.list.set(this.as.list);
      this.inventarioDataSource.data = this.list();
      this.pageIndex.set(this.as.pageIndex);
      this.pags.set(this.as.pags);
      this.inventarioDisplayedColumns = this.as.inventarioDisplayedColumns;
    } else {
      this.buscar();
    }
  }

  buscar(): void {
    this.as.getInventario(this.buscador()).subscribe((result: BuscadorAlmacenResult): void => {
      this.list.set(this.cms.getInventarioItems(result.list));
      this.inventarioDataSource.data = this.list();
      this.pags.set(result.pags);
      this.mediaMargen.set(this.calcularMediaMargen(this.list()));
      this.totalPVP.set(result.totalPVP);
      this.totalPUC.set(result.totalPUC);

      this.saveState();
    });
  }

  updateBuscador(changes: Partial<BuscadorAlmacenInterface>): void {
    this.buscador.update((value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
      return this.cloneBuscador(value, changes);
    });
  }

  resetBuscar(debounce: boolean = false): void {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    this.pageIndex.set(0);
    this.buscador.update((value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
      return this.cloneBuscador(value, { pagina: 1 });
    });
    if (debounce) {
      this.searchTimeout = setTimeout((): void => {
        this.searchTimeout = null;
        this.buscar();
      }, 300);
    } else {
      this.buscar();
    }
  }

  cambiarOrden(sort: Sort): void {
    if (sort.direction === '') {
      this.buscador.update((value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
        return this.cloneBuscador(value, {
          orderBy: null,
          orderSent: null,
        });
      });
    } else {
      this.buscador.update((value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
        return this.cloneBuscador(value, {
          orderBy: sort.active,
          orderSent: sort.direction,
        });
      });
    }
    this.buscar();
  }

  changePage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.buscador.update((value: BuscadorAlmacenInterface): BuscadorAlmacenInterface => {
      return this.cloneBuscador(value, {
        pagina: ev.pageIndex + 1,
        num: ev.pageSize,
      });
    });
    this.buscar();
  }

  changeColumns(values: string[]): void {
    const selectedValues: Set<string> = new Set<string>(values);
    this.inventarioDisplayedColumns = this.columns
      .filter((col: InventarioColumn): boolean => selectedValues.has(col.value))
      .map((col: InventarioColumn): string => col.value);
    this.as.inventarioDisplayedColumns = [...this.inventarioDisplayedColumns];
  }

  calcularMediaMargen(array: InventarioItem[]): number {
    if (!array.length) return 0;

    const suma: number = array.reduce(
      (total: number, item: InventarioItem): number => total + item.margen,
      0,
    );
    return suma / array.length;
  }

  hasChanges(): boolean {
    return this.list().some((item: InventarioItem): boolean => this.itemHasChanges(item));
  }

  itemHasChanges(item: InventarioItem): boolean {
    return item.pvpChanged || item.stockChanged || this.hasCodigoBarrasValue(item);
  }

  saveAll(): void {
    const list: InventarioItemInterface[] = [];
    for (const item of this.list()) {
      if (this.itemHasChanges(item)) {
        this.normalizeCodigoBarras(item);
        list.push(item.toInterface());
      }
    }

    if (list.length === 0) {
      return;
    }

    this.as.saveAllInventario(list).subscribe((result: StatusIdMessageErrorsResult): void => {
      const errorList: string[] = [];

      for (const status of result.list) {
        const ind: number = this.list().findIndex((x: InventarioItem): boolean => {
          return x.id === status.id;
        });
        if (ind === -1) {
          continue;
        }

        if (status.status === ApiStatusEnum.OK) {
          this.list.update((value: InventarioItem[]): InventarioItem[] => {
            const list: InventarioItem[] = [...value];
            list[ind] = this.getSavedItem(list[ind]);
            return list;
          });
          this.inventarioDataSource.data = this.list();
        } else {
          errorList.push(
            '<strong>' + this.list()[ind].nombre + '</strong>: ' + urldecode(status.message),
          );
        }
      }
      if (errorList.length > 0) {
        this.dialog.alert({
          title: 'Error',
          content:
            'Al realizar el guardado, han ocurrido los siguientes errores:<br><br>' +
            errorList.join('<br>'),
        });
      }
    });
  }

  saveInventario(item: InventarioItem): void {
    this.normalizeCodigoBarras(item);
    this.as.saveInventario(item.toInterface()).subscribe((result: StatusIdMessageResult): void => {
      if (result.status === ApiStatusEnum.OK) {
        this.updateInventarioItem(item.id, this.getSavedItem(item));
      } else {
        this.dialog.alert({
          title: 'Error',
          content: urldecode(result.message),
        });
      }
    });
  }

  deleteInventario(item: InventarioItem): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estas seguro de querer borrar el artículo "' + item.nombre + '"?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.as.deleteInventario(item.id as number).subscribe((result: StatusResult): void => {
            if (result.status === ApiStatusEnum.OK) {
              this.list.update((value: InventarioItem[]): InventarioItem[] => {
                return value.filter((x: InventarioItem): boolean => x.id !== item.id);
              });
              this.inventarioDataSource.data = this.list();
            } else {
              this.dialog.alert({
                title: 'Error',
                content: 'Ocurrió un error al borrar el artículo.',
              });
            }
          });
        }
      });
  }

  exportInventario(): void {
    this.as.exportInventario(this.buscador()).subscribe((result): void => {
      const data: Blob = new Blob([result], {
        type: 'text/csv;charset=utf-8',
      });
      const url: string = window.URL.createObjectURL(data);
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.download = 'inventario.csv';
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    });
  }

  printInventario(): void {
    const data: string = window.btoa(JSON.stringify(this.buscador()));
    window.open('/almacen/inventario-print/' + data);
  }

  goToArticulo(ev: MouseEvent, item: InventarioItem): void {
    if (ev) {
      ev.preventDefault();
    }
    this.ars.returnInfo = {
      where: 'almacen',
      id: null,
      extra: null,
    };
    this.ars.newArticulo(item.localizador);
    this.router.navigate(['/articulos']);
  }

  ngOnDestroy(): void {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    this.saveState();
  }

  private saveState(): void {
    this.as.buscador = this.buscador();
    this.as.list = this.list();
    this.as.pags = this.pags();
    this.as.pageIndex = this.pageIndex();
    this.as.inventarioDisplayedColumns = [...this.inventarioDisplayedColumns];
    this.as.firstLoad = false;
  }

  private updateInventarioItem(id: number | null, item: InventarioItem): void {
    this.list.update((value: InventarioItem[]): InventarioItem[] => {
      return value.map((listItem: InventarioItem): InventarioItem => {
        return listItem.id === id ? item : listItem;
      });
    });
    this.inventarioDataSource.data = this.list();
  }

  private getSavedItem(item: InventarioItem): InventarioItem {
    const savedItem: InventarioItem = this.cloneInventarioItem(item);
    savedItem._pvp = savedItem.pvp;
    savedItem._stock = savedItem.stock;
    if (this.hasCodigoBarrasValue(savedItem)) {
      savedItem.hasCodigosBarras = true;
      savedItem.codigoBarras = null;
    }

    return savedItem;
  }

  private normalizeCodigoBarras(item: InventarioItem): void {
    if (item.codigoBarras !== null) {
      const codigoBarras: string = item.codigoBarras.trim();
      item.codigoBarras = codigoBarras !== '' ? codigoBarras : null;
    }
  }

  hasCodigoBarrasValue(item: InventarioItem): boolean {
    return item.codigoBarras !== null && item.codigoBarras.trim() !== '';
  }

  private cloneBuscador(
    buscador: BuscadorAlmacenInterface,
    changes: Partial<BuscadorAlmacenInterface> = {}
  ): BuscadorAlmacenInterface {
    return Object.assign({}, buscador, changes);
  }

  private cloneInventarioItem(item: InventarioItem): InventarioItem {
    return Object.assign(new InventarioItem(), item);
  }
}
