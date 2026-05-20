import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { BuscadorAlmacenInterface, BuscadorAlmacenResult } from '@interfaces/almacen.interface';
import InventarioItem from '@model/almacen/inventario-item.model';
import Marca from '@model/marcas/marca.model';
import Proveedor from '@model/proveedores/proveedor.model';
import { CustomOverlayRef } from '@osumi/angular-tools';
import AlmacenService from '@services/almacen.service';
import ClassMapperService from '@services/class-mapper.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';

@Component({
  selector: 'otpv-buscador-avanzado-modal',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    MatTooltip,
    MatCheckbox,
    MatButton,
    FormsModule,
  ],
  templateUrl: './buscador-avanzado-modal.component.html',
  styleUrl: './buscador-avanzado-modal.component.scss',
})
export default class BuscadorAvanzadoModalComponent implements OnInit {
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly ps: ProveedoresService = inject(ProveedoresService);
  private readonly as: AlmacenService = inject(AlmacenService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly customOverlayRef: CustomOverlayRef = inject(CustomOverlayRef);

  marcas: Marca[] = this.ms.marcas();
  proveedores: Proveedor[] = this.ps.proveedores();
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
  nombreBox: Signal<ElementRef<HTMLInputElement>> =
    viewChild.required<ElementRef<HTMLInputElement>>('nombreBox');
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  list: WritableSignal<InventarioItem[]> = signal<InventarioItem[]>([]);
  pags: WritableSignal<number> = signal<number>(0);
  pageIndex: WritableSignal<number> = signal<number>(0);

  inventarioDisplayedColumns: string[] = [
    'select',
    'localizador',
    'proveedor',
    'marca',
    'referencia',
    'nombre',
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();
  selectedLines: number[] = [];

  ngOnInit(): void {
    this.nombreBox().nativeElement.focus();
  }

  buscar(): void {
    this.as.getInventario(this.buscador()).subscribe((result: BuscadorAlmacenResult): void => {
      this.selectedLines = [];
      this.list.set(this.cms.getInventarioItems(result.list));
      this.inventarioDataSource.data = this.list();
      this.pags.set(result.pags);
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

  private cloneBuscador(
    buscador: BuscadorAlmacenInterface,
    changes: Partial<BuscadorAlmacenInterface> = {},
  ): BuscadorAlmacenInterface {
    return Object.assign({}, buscador, changes);
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

  selectLine(row: InventarioItem, ev: MouseEvent): void {
    if (ev) {
      ev.stopPropagation();
    }
    if (this.selectedLines.includes(row.localizador as number)) {
      this.selectedLines = this.selectedLines.filter(
        (line: number): boolean => line !== row.localizador,
      );
    } else {
      this.selectedLines.push(row.localizador as number);
    }
  }

  selectBuscadorResultadosRow(row: InventarioItem): void {
    this.customOverlayRef.close(row.localizador);
  }

  selectBuscadorResultados(): void {
    this.customOverlayRef.close(this.selectedLines);
  }
}
