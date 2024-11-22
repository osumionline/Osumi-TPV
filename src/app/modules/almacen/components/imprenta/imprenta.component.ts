import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { ArticuloBuscadorResult } from '@interfaces/articulo.interface';
import ArticuloBuscador from '@model/articulos/articulo-buscador.model';
import ImprentaTableComponent from '@modules/almacen/components/imprenta-table/imprenta-table.component';
import { DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import VentasService from '@services/ventas.service';

@Component({
  selector: 'otpv-imprenta',
  templateUrl: './imprenta.component.html',
  styleUrls: ['./imprenta.component.scss'],
  imports: [
    FormsModule,
    ImprentaTableComponent,
    MatFormField,
    MatInput,
    MatIcon,
    MatActionList,
    MatListItem,
    MatTooltip,
    MatSlideToggle,
    MatButton,
    CdkDropList,
    CdkDrag,
  ],
})
export default class ImprentaComponent {
  private vs: VentasService = inject(VentasService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);

  searchBox: Signal<ElementRef> = viewChild('searchBox');
  search: WritableSignal<string> = signal<string>('');
  searchTimer: number = null;
  searching: boolean = false;
  articulos: WritableSignal<ArticuloBuscador[]> = signal<ArticuloBuscador[]>(
    []
  );
  tabla: Signal<ImprentaTableComponent> = viewChild('tabla');
  seleccionados: WritableSignal<ArticuloBuscador[]> = signal<
    ArticuloBuscador[]
  >([]);
  filas: WritableSignal<number> = signal<number>(4);
  columnas: WritableSignal<number> = signal<number>(5);
  mostrarPVP: WritableSignal<boolean> = signal<boolean>(true);

  searchFocus(): void {
    window.setTimeout((): void => {
      this.searchBox().nativeElement.focus();
    }, 100);
  }

  buscadorStart(): void {
    this.buscadorStop();
    this.searchTimer = window.setTimeout((): void => {
      this.buscar();
    }, 300);
  }

  searchStart(): void {
    if (this.search() === '') {
      this.articulos.set([]);
    } else {
      if (!this.searching) {
        this.buscadorStart();
      }
    }
  }

  buscadorStop(): void {
    window.clearTimeout(this.searchTimer);
  }

  buscar(): void {
    this.buscadorStop();
    this.searching = true;
    this.vs
      .search(this.search())
      .subscribe((result: ArticuloBuscadorResult): void => {
        this.searching = false;
        this.articulos.set(this.cms.getArticulosBuscador(result.list));
      });
  }

  selectArticulo(articulo: ArticuloBuscador): void {
    const ind: number = this.seleccionados().findIndex(
      (x: ArticuloBuscador): boolean => {
        return x.localizador === articulo.localizador;
      }
    );
    if (ind === -1) {
      articulo.num = 1;
      this.seleccionados.update(
        (value: ArticuloBuscador[]): ArticuloBuscador[] => {
          value.push(articulo);
          return value;
        }
      );
    } else {
      this.seleccionados.update(
        (value: ArticuloBuscador[]): ArticuloBuscador[] => {
          value[ind].num++;
          return value;
        }
      );
    }
    this.updateTable();
  }

  addHueco(): void {
    const maxInd: number = this.seleccionados.length - 1;
    if (
      this.seleccionados()[maxInd] !== undefined &&
      this.seleccionados()[maxInd].localizador === null
    ) {
      this.seleccionados.update(
        (value: ArticuloBuscador[]): ArticuloBuscador[] => {
          value[maxInd].num++;
          return value;
        }
      );
    } else {
      const hueco: ArticuloBuscador = new ArticuloBuscador();
      hueco.nombre = 'Hueco';
      hueco.marca = 'Hueco en blanco';
      hueco.localizador = null;
      hueco.num = 1;
      hueco.pvp = null;
      this.seleccionados.update(
        (value: ArticuloBuscador[]): ArticuloBuscador[] => {
          value.push(hueco);
          return value;
        }
      );
    }
    this.updateTable();
  }

  deleteLinea(ind: number): void {
    this.seleccionados.update(
      (value: ArticuloBuscador[]): ArticuloBuscador[] => {
        value.splice(ind, 1);
        return value;
      }
    );
    this.updateTable();
  }

  addLineaNum(ind: number, amount: number): void {
    const cantidadTotal: number = this.getCantidadTotal();
    //const cantidadMax: number = this.getCantidadMax();

    if (amount === -1) {
      if (this.seleccionados()[ind].num === 1) {
        return;
      }
      this.seleccionados()[ind].num--;
      this.updateTable();
    } else {
      if (this.checkCantidad(cantidadTotal + 1)) {
        this.seleccionados.update(
          (value: ArticuloBuscador[]): ArticuloBuscador[] => {
            value[ind].num++;
            return value;
          }
        );
        this.updateTable();
      }
    }
  }

  updateTable(): void {
    this.tabla().calcularLista(
      this.filas(),
      this.columnas(),
      this.seleccionados(),
      this.mostrarPVP()
    );
  }

  checkCantidad(num: number): boolean {
    const cantidadMax: number = this.getCantidadMax();

    if (num > this.getCantidadMax()) {
      this.dialog.alert({
        title: 'Error',
        content:
          'El número máximo de etiquetas que puedes imprimir es ' + cantidadMax,
      });
      return false;
    }
    return true;
  }

  getCantidadTotal(): number {
    return this.seleccionados().reduce(
      (total: number, item: ArticuloBuscador): number => total + item.num,
      0
    );
  }

  getCantidadMax(): number {
    return this.filas() * this.columnas();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.seleccionados(),
      event.previousIndex,
      event.currentIndex
    );
    this.updateTable();
  }
}
