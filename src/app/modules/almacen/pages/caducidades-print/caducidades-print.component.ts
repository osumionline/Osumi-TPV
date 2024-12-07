import { Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Params } from '@angular/router';
import { BuscadorCaducidadesInterface } from '@interfaces/caducidad.interface';
import {
  InformeCaducidadesResult,
  InformeCaducidadesYearInterface,
} from '@interfaces/informes.interface';
import FixedNumberPipe from '@modules/shared/pipes/fixed-number.pipe';
import MonthNamePipe from '@modules/shared/pipes/month-name.pipe';
import ClassMapperService from '@services/class-mapper.service';
import InformesService from '@services/informes.service';

@Component({
  selector: 'otpv-caducidades-print',
  imports: [MatIconButton, MatIcon, FixedNumberPipe, MonthNamePipe],
  templateUrl: './caducidades-print.component.html',
  styleUrl: './caducidades-print.component.scss',
})
export default class CaducidadesPrintComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private is: InformesService = inject(InformesService);
  private cms: ClassMapperService = inject(ClassMapperService);

  buscador: BuscadorCaducidadesInterface | null = null;
  data: InformeCaducidadesYearInterface[] = [];
  expandedItems: Set<string> = new Set<string>();
  totalUnidades: number = 0;
  totalPVP: number = 0;
  totalPUC: number = 0;

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      const data: string = params.data;
      try {
        const objStr: string = window.atob(data);
        this.buscador = JSON.parse(objStr);
      } catch (error) {
        console.log(error);
        this.buscador = null;
      }
      if (this.buscador === null) {
        alert('¡Ocurrió un error al obtener los datos!');
      } else {
        this.load();
      }
    });
  }

  load(): void {
    this.is
      .getInformeCaducidades(this.buscador)
      .subscribe((result: InformeCaducidadesResult): void => {
        this.data = result.data;
        this.totalUnidades = this.data.reduce(
          (sum: number, year: InformeCaducidadesYearInterface): number =>
            sum + year.totalUnidades,
          0
        );
        this.totalPVP = this.data.reduce(
          (sum: number, year: InformeCaducidadesYearInterface): number =>
            sum + year.totalPVP,
          0
        );
        this.totalPUC = this.data.reduce(
          (sum: number, year: InformeCaducidadesYearInterface): number =>
            sum + year.totalPUC,
          0
        );
      });
  }

  toggleExpand(identifier: string): void {
    if (this.expandedItems.has(identifier)) {
      this.expandedItems.delete(identifier);
    } else {
      this.expandedItems.add(identifier);
    }
  }

  isExpanded(identifier: string): boolean {
    return this.expandedItems.has(identifier);
  }
}
