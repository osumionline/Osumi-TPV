import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ArticuloBuscadorResult } from '@interfaces/articulo.interface';
import ArticuloBuscador from '@model/articulos/articulo-buscador.model';
import { CustomOverlayRef } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import VentasService from '@services/ventas.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-buscador-modal',
  templateUrl: './buscador-modal.component.html',
  styleUrls: ['./buscador-modal.component.scss'],
  imports: [
    FormsModule,
    MatSortModule,
    MatFormField,
    MatInput,
    MatTableModule,
    FixedNumberPipe,
    MatCheckbox,
    MatButton,
  ],
})
export default class BuscadorModalComponent implements OnInit, AfterViewInit, OnDestroy {
  private vs: VentasService = inject(VentasService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private customOverlayRef: CustomOverlayRef<null, { key: string; showSelect?: boolean }> =
    inject(CustomOverlayRef);

  searchBoxName: Signal<ElementRef> = viewChild.required<ElementRef>('searchBoxName');
  searchName: string = '';
  searchTimer: number | undefined = undefined;
  searching: boolean = false;
  buscadorResultadosList: ArticuloBuscador[] = [];
  buscadorResultadosRow: number = 0;
  buscadorResultadosDisplayedColumns: string[] = ['select', 'nombre', 'marca', 'pvp', 'stock'];
  buscadorResultadosDataSource: MatTableDataSource<ArticuloBuscador> =
    new MatTableDataSource<ArticuloBuscador>();
  sort: Signal<MatSort> = viewChild.required(MatSort);
  selectedLines: number[] = [];
  showSelectCol: boolean = false;

  ngOnInit(): void {
    this.searchName = this.customOverlayRef.data.key;
    this.showSelectCol = this.customOverlayRef.data.showSelect ?? false;

    // Define columnas dinámicamente
    this.buscadorResultadosDisplayedColumns = this.showSelectCol
      ? ['select', 'nombre', 'marca', 'pvp', 'stock']
      : ['nombre', 'marca', 'pvp', 'stock'];

    this.buscadorResultadosRow = 0;
    setTimeout((): void => {
      this.searchBoxName().nativeElement.focus();
    }, 0);
    this.searchStart();
  }

  ngAfterViewInit(): void {
    this.buscadorResultadosDataSource.sort = this.sort();
  }

  checkVisible(elm: HTMLElement): boolean {
    const rect: DOMRect = elm.getBoundingClientRect();
    const viewHeight: number = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  focusRow(): void {
    const element: HTMLElement | null = document.getElementById(
      'buscador-row-' + this.buscadorResultadosList[this.buscadorResultadosRow].localizador
    );
    if (element !== null && !this.checkVisible(element)) {
      element.scrollIntoView();
    }
  }

  checkSearchKeys(ev: KeyboardEvent | null = null): void {
    if (ev !== null && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter')) {
      ev.preventDefault();
      if (ev.key === 'ArrowUp') {
        if (this.buscadorResultadosRow === 0) {
          return;
        }
        this.buscadorResultadosRow--;
        this.focusRow();
      }
      if (ev.key === 'ArrowDown') {
        if (this.buscadorResultadosRow === this.buscadorResultadosList.length - 1) {
          return;
        }
        this.buscadorResultadosRow++;
        this.focusRow();
      }
      if (ev.key === 'Enter') {
        this.selectBuscadorResultadosRow(this.buscadorResultadosList[this.buscadorResultadosRow]);
      }
    }
  }

  searchStart(ev: KeyboardEvent | null = null): void {
    if (ev !== null && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter')) {
      ev.preventDefault();
    } else {
      if (this.searchName === '') {
        this.buscadorResultadosList = [];
        this.buscadorResultadosRow = 0;
      } else {
        if (!this.searching) {
          this.buscadorStart();
        }
      }
    }
  }

  buscadorStart(): void {
    this.buscadorStop();
    this.searchTimer = window.setTimeout((): void => {
      this.buscar();
    }, 300);
  }

  buscadorStop(): void {
    clearTimeout(this.searchTimer);
  }

  buscar(): void {
    this.buscadorStop();
    this.searching = true;
    this.selectedLines = [];
    this.vs.search(this.searchName).subscribe((result: ArticuloBuscadorResult): void => {
      this.searching = false;
      this.buscadorResultadosRow = 0;
      this.buscadorResultadosList = this.cms.getArticulosBuscador(result.list);
      this.buscadorResultadosDataSource.data = this.buscadorResultadosList;
    });
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.customOverlayRef.close(row.localizador);
  }

  selectLine(row: ArticuloBuscador, ev: MouseEvent): void {
    if (ev) {
      ev.stopPropagation();
    }
    if (this.selectedLines.includes(row.localizador as number)) {
      this.selectedLines = this.selectedLines.filter(
        (line: number): boolean => line !== row.localizador
      );
    } else {
      this.selectedLines.push(row.localizador as number);
    }
  }

  selectBuscadorLines(): void {
    this.customOverlayRef.close(this.selectedLines);
  }

  ngOnDestroy(): void {
    this.buscadorStop();
  }
}
