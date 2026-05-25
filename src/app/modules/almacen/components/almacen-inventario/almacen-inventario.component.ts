import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
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
import ApiStatusEnum from '@enum/api-status.enum';
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioColumn,
  InventarioItemInterface,
} from '@interfaces/almacen.interface';
import { CategoriaInterface } from '@interfaces/articulo.interface';
import {
  StatusIdMessageErrorsResult,
  StatusIdMessageResult,
  StatusResult,
} from '@interfaces/interfaces';
import InventarioItem from '@model/almacen/inventario-item.model';
import Marca from '@model/marcas/marca.model';
import Proveedor from '@model/proveedores/proveedor.model';
import { DialogService } from '@osumi/angular-tools';
import { urldecode } from '@osumi/tools';
import AlmacenService from '@services/almacen.service';
import ArticulosService from '@services/articulos.service';
import CategoriasService from '@services/categorias.service';
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
  private readonly cs: CategoriasService = inject(CategoriasService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);

  buscador: WritableSignal<BuscadorAlmacenInterface> = signal({
    idProveedor: null,
    idMarca: null,
    idCategoria: null,
    nombre: null,
    descuento: false,
    orderBy: null,
    orderSent: null,
    pagina: 1,
    num: 50,
  });
  list: WritableSignal<InventarioItem[]> = signal<InventarioItem[]>([]);
  numericFieldDrafts: WritableSignal<Record<string, string>> = signal<Record<string, string>>({});
  hasChanges = computed((): boolean => {
    return this.list().some((item: InventarioItem): boolean => this.itemHasChanges(item));
  });
  pags: WritableSignal<number> = signal<number>(0);
  pageIndex: WritableSignal<number> = signal<number>(0);
  mediaMargen: WritableSignal<number> = signal<number>(0);
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

  marcas: Marca[] = this.ms.marcas();
  proveedores: Proveedor[] = this.ps.proveedores();
  categoriesPlain: WritableSignal<CategoriaInterface[]> = signal<CategoriaInterface[]>(
    this.cs.categoriasPlain,
  );

  columns: InventarioColumn[] = [
    { value: 'localizador', name: 'Localizador' },
    { value: 'proveedor', name: 'Proveedor' },
    { value: 'marca', name: 'Marca' },
    { value: 'referencia', name: 'Referencia' },
    { value: 'categoria', name: 'Categoría' },
    { value: 'nombre', name: 'Nombre' },
    { value: 'stock', name: 'Stock' },
    { value: 'palb', name: 'Precio albarán' },
    { value: 'puc', name: 'PUC' },
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
      (total: number, item: InventarioItem): number => total + item.margenActualizado,
      0,
    );
    return suma / array.length;
  }

  itemHasChanges(item: InventarioItem): boolean {
    return (
      item.categoriaChanged ||
      item.palbChanged ||
      item.pucChanged ||
      item.pvpChanged ||
      item.stockChanged ||
      this.hasCodigoBarrasValue(item)
    );
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

  updateItemCategoria(item: InventarioItem, value: number | null): void {
    this.updateItem(item, { idCategoria: value });
  }

  resetItemCategoria(item: InventarioItem): void {
    this.updateItem(item, { idCategoria: item._idCategoria });
  }

  updateItemStock(item: InventarioItem, value: number | string | null): void {
    this.clearNumericFieldDrafts(item, ['stock']);
    this.updateItem(item, { stock: this.getNullableNumber(value) });
  }

  resetItemStock(item: InventarioItem): void {
    this.clearNumericFieldDrafts(item, ['stock']);
    this.updateItem(item, { stock: item._stock });
  }

  getNumericFieldValue(item: InventarioItem, field: NumericEditableField): string | number | null {
    const draftValue: string | undefined =
      this.numericFieldDrafts()[this.getNumericFieldDraftKey(item, field)];

    if (draftValue !== undefined) {
      return draftValue;
    }

    return this.getCurrentNumericFieldValue(item, field);
  }

  updateNumericFieldDraft(
    item: InventarioItem,
    field: NumericEditableField,
    value: string | null,
  ): void {
    const draftKey: string = this.getNumericFieldDraftKey(item, field);

    this.numericFieldDrafts.update(
      (currentDrafts: Record<string, string>): Record<string, string> => {
        return {
          ...currentDrafts,
          [draftKey]: value ?? '',
        };
      },
    );
  }

  commitNumericFieldDraft(item: InventarioItem, field: NumericEditableField): boolean {
    const draftKey: string = this.getNumericFieldDraftKey(item, field);
    const draftValue: string | undefined = this.numericFieldDrafts()[draftKey];

    if (draftValue === undefined) {
      return true;
    }

    this.clearNumericFieldDrafts(item, [field]);

    const parsedValue: number | null | undefined = this.parseNullableDecimal(draftValue);
    if (parsedValue === undefined) {
      return false;
    }

    switch (field) {
      case 'stock':
        this.updateItemStock(item, parsedValue);
        break;
      case 'palb':
        this.updateItemPalb(item, parsedValue);
        break;
      case 'puc':
        this.updateItemPuc(item, parsedValue);
        break;
      case 'pvp':
        this.updateItemPvp(item, parsedValue);
        break;
    }

    return true;
  }

  commitAndNext(ev: Event, item: InventarioItem, field: NumericEditableField): void {
    ev.preventDefault();

    const nextItem: InventarioItem | null = this.getNextItem(item);
    const committed: boolean = this.commitNumericFieldDraft(item, field);

    if (!committed || nextItem === null) {
      return;
    }

    setTimeout((): void => {
      this.focusNumericField(nextItem, field);
    });
  }

  cancelNumericFieldDraft(item: InventarioItem, field: NumericEditableField): void {
    this.clearNumericFieldDrafts(item, [field]);
  }

  updateItemPalb(item: InventarioItem, value: number | string | null): void {
    const palb: number | null = this.getNullableNumber(value);
    const puc: number | null = this.calculatePucFromPalb(item, palb);
    const pvp: number | null = this.calculatePvpFromPuc(item, puc);

    this.clearNumericFieldDrafts(item, ['palb', 'puc', 'pvp']);
    this.updateItem(item, { palb, puc, pvp });
  }

  resetItemPalb(item: InventarioItem): void {
    const puc: number | null = this.calculatePucFromPalb(item, item._palb);
    const pvp: number | null = this.calculatePvpFromPuc(item, puc);

    this.clearNumericFieldDrafts(item, ['palb', 'puc', 'pvp']);
    this.updateItem(item, { palb: item._palb, puc, pvp });
  }

  updateItemPuc(item: InventarioItem, value: number | string | null): void {
    const puc: number | null = this.getNullableNumber(value);
    const palb: number | null = this.calculatePalbFromPuc(item, puc);
    const pvp: number | null = this.calculatePvpFromPuc(item, puc);

    this.clearNumericFieldDrafts(item, ['palb', 'puc', 'pvp']);
    this.updateItem(item, { palb, puc, pvp });
  }

  resetItemPuc(item: InventarioItem): void {
    const palb: number | null = this.calculatePalbFromPuc(item, item._puc);
    const pvp: number | null = this.calculatePvpFromPuc(item, item._puc);

    this.clearNumericFieldDrafts(item, ['palb', 'puc', 'pvp']);
    this.updateItem(item, { palb, puc: item._puc, pvp });
  }

  updateItemPvp(item: InventarioItem, value: number | string | null): void {
    this.clearNumericFieldDrafts(item, ['pvp']);
    this.updateItem(item, { pvp: this.getNullableNumber(value) });
  }

  resetItemPvp(item: InventarioItem): void {
    this.clearNumericFieldDrafts(item, ['pvp']);
    this.updateItem(item, { pvp: item._pvp });
  }

  resetItemChanges(item: InventarioItem): void {
    this.clearNumericFieldDrafts(item, ['stock', 'palb', 'puc', 'pvp']);
    this.updateItem(item, {
      idCategoria: item._idCategoria,
      stock: item._stock,
      palb: item._palb,
      puc: item._puc,
      pvp: item._pvp,
      codigoBarras: null,
    });
  }

  updateItemCodigoBarras(item: InventarioItem, value: string | null): void {
    this.updateItem(item, { codigoBarras: value });
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

  private updateItem(item: InventarioItem, changes: Partial<InventarioItem>): void {
    this.list.update((value: InventarioItem[]): InventarioItem[] => {
      const index: number =
        item.id !== null
          ? value.findIndex((listItem: InventarioItem): boolean => listItem.id === item.id)
          : value.indexOf(item);
      if (index === -1) {
        return value;
      }

      const list: InventarioItem[] = [...value];
      list[index] = this.cloneInventarioItem(Object.assign({}, list[index], changes));

      return list;
    });
    this.inventarioDataSource.data = this.list();
  }

  private getNullableNumber(value: number | string | null): number | null {
    if (value === null || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const parsedValue: number = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  private parseNullableDecimal(value: string): number | null | undefined {
    const normalizedValue: string = value.trim().replace(',', '.');

    if (normalizedValue === '') {
      return null;
    }

    if (!/^-?\d*(?:\.\d*)?$/.test(normalizedValue)) {
      return undefined;
    }

    const parsedValue: number = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  private getCurrentNumericFieldValue(
    item: InventarioItem,
    field: NumericEditableField,
  ): number | null {
    switch (field) {
      case 'stock':
        return item.stock;
      case 'palb':
        return item.palb;
      case 'puc':
        return item.puc;
      case 'pvp':
        return item.pvp;
    }
  }

  private getNumericFieldDraftKey(item: InventarioItem, field: NumericEditableField): string {
    return `${item.id ?? 'new'}:${field}`;
  }

  private getNextItem(item: InventarioItem): InventarioItem | null {
    const list: InventarioItem[] = this.inventarioDataSource.data;
    const index: number =
      item.id !== null
        ? list.findIndex((listItem: InventarioItem): boolean => listItem.id === item.id)
        : list.indexOf(item);

    return index !== -1 && index < list.length - 1 ? list[index + 1] : null;
  }

  private focusNumericField(item: InventarioItem, field: NumericEditableField): void {
    const input: HTMLInputElement | null = document.querySelector(
      `input[data-inventory-id="${item.id ?? 'new'}"][data-inventory-field="${field}"]`,
    );

    if (input === null) {
      return;
    }

    input.focus();
    input.select();
  }

  private clearNumericFieldDrafts(item: InventarioItem, fields: NumericEditableField[]): void {
    this.numericFieldDrafts.update(
      (currentDrafts: Record<string, string>): Record<string, string> => {
        const nextDrafts: Record<string, string> = { ...currentDrafts };

        for (const field of fields) {
          delete nextDrafts[this.getNumericFieldDraftKey(item, field)];
        }

        return nextDrafts;
      },
    );
  }

  private getTaxFactor(item: InventarioItem): number {
    return 1 + this.getPercentageFactor(item.iva) + this.getPercentageFactor(item.re);
  }

  private getMargenFactor(item: InventarioItem): number {
    return 1 + this.getPercentageFactor(item.margen);
  }

  private getPercentageFactor(value: number | null): number {
    return (value ?? 0) / 100;
  }

  private calculatePucFromPalb(item: InventarioItem, palb: number | null): number | null {
    if (palb === null) {
      return null;
    }

    return this.roundPrice(palb * this.getTaxFactor(item));
  }

  private calculatePalbFromPuc(item: InventarioItem, puc: number | null): number | null {
    if (puc === null) {
      return null;
    }

    const taxFactor: number = this.getTaxFactor(item);
    if (taxFactor === 0) {
      return null;
    }

    return this.roundPrice(puc / taxFactor);
  }

  private calculatePvpFromPuc(item: InventarioItem, puc: number | null): number | null {
    if (puc === null) {
      return null;
    }

    return this.roundPrice(puc * this.getMargenFactor(item));
  }

  private roundPrice(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private getSavedItem(item: InventarioItem): InventarioItem {
    const savedItem: InventarioItem = this.cloneInventarioItem(item);
    savedItem._idCategoria = savedItem.idCategoria;
    savedItem._palb = savedItem.palb;
    savedItem._puc = savedItem.puc;
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
    changes: Partial<BuscadorAlmacenInterface> = {},
  ): BuscadorAlmacenInterface {
    return Object.assign({}, buscador, changes);
  }

  private cloneInventarioItem(item: InventarioItem): InventarioItem {
    return Object.assign(new InventarioItem(), item);
  }
}

type NumericEditableField = 'stock' | 'palb' | 'puc' | 'pvp';
