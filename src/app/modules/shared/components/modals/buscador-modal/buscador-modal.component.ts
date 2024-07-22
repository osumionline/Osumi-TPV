import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ArticuloBuscadorResult } from '@interfaces/articulo.interface';
import ArticuloBuscador from '@model/articulos/articulo-buscador.model';
import { CustomOverlayRef } from '@model/tpv/custom-overlay-ref.model';
import ClassMapperService from '@services/class-mapper.service';
import VentasService from '@services/ventas.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  standalone: true,
  selector: 'otpv-buscador-modal',
  templateUrl: './buscador-modal.component.html',
  styleUrls: ['./buscador-modal.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    MatSortModule,
    MatFormField,
    MatInput,
    MatTableModule,
    FixedNumberPipe,
  ],
})
export default class BuscadorModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private vs: VentasService = inject(VentasService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private customOverlayRef: CustomOverlayRef<null, { key: string }> =
    inject(CustomOverlayRef);

  @ViewChild('searchBoxName', { static: true }) searchBoxName: ElementRef;
  searchName: string = '';
  searchTimer: number = null;
  searching: boolean = false;
  buscadorResultadosList: ArticuloBuscador[] = [];
  buscadorResultadosRow: number = 0;
  buscadorResultadosDisplayedColumns: string[] = [
    'nombre',
    'marca',
    'pvp',
    'stock',
  ];
  buscadorResultadosDataSource: MatTableDataSource<ArticuloBuscador> =
    new MatTableDataSource<ArticuloBuscador>();
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.searchName = this.customOverlayRef.data.key;
    this.buscadorResultadosRow = 0;
    setTimeout((): void => {
      this.searchBoxName.nativeElement.focus();
    }, 0);
    this.searchStart();
  }

  ngAfterViewInit(): void {
    this.buscadorResultadosDataSource.sort = this.sort;
  }

  checkVisible(elm: HTMLElement): boolean {
    const rect: DOMRect = elm.getBoundingClientRect();
    const viewHeight: number = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  focusRow(): void {
    const element: HTMLElement = document.getElementById(
      'buscador-row-' +
        this.buscadorResultadosList[this.buscadorResultadosRow].localizador
    );
    if (!this.checkVisible(element)) {
      element.scrollIntoView();
    }
  }

  checkSearchKeys(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter')
    ) {
      ev.preventDefault();
      if (ev.key === 'ArrowUp') {
        if (this.buscadorResultadosRow === 0) {
          return;
        }
        this.buscadorResultadosRow--;
        this.focusRow();
      }
      if (ev.key === 'ArrowDown') {
        if (
          this.buscadorResultadosRow ===
          this.buscadorResultadosList.length - 1
        ) {
          return;
        }
        this.buscadorResultadosRow++;
        this.focusRow();
      }
      if (ev.key === 'Enter') {
        this.selectBuscadorResultadosRow(
          this.buscadorResultadosList[this.buscadorResultadosRow]
        );
      }
    }
  }

  searchStart(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter')
    ) {
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
    this.vs
      .search(this.searchName)
      .subscribe((result: ArticuloBuscadorResult): void => {
        this.searching = false;
        this.buscadorResultadosRow = 0;
        this.buscadorResultadosList = this.cms.getArticulosBuscador(
          result.list
        );
        this.buscadorResultadosDataSource.data = this.buscadorResultadosList;
      });
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.customOverlayRef.close(row.localizador);
  }

  ngOnDestroy(): void {
    this.buscadorStop();
  }
}
