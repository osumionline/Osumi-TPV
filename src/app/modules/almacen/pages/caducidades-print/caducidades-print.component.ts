import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BuscadorCaducidadesInterface } from '@interfaces/caducidad.interface';
import {
  InformeCaducidadesResult,
  InformeCaducidadesYearInterface,
} from '@interfaces/informes.interface';
import FixedNumberPipe from '@modules/shared/pipes/fixed-number.pipe';
import MonthNamePipe from '@modules/shared/pipes/month-name.pipe';
import InformesService from '@services/informes.service';

@Component({
  selector: 'otpv-caducidades-print',
  imports: [MatIconButton, MatIcon, FixedNumberPipe, MonthNamePipe],
  templateUrl: './caducidades-print.component.html',
  styleUrl: './caducidades-print.component.scss',
})
export default class CaducidadesPrintComponent implements OnInit {
  private is: InformesService = inject(InformesService);

  data: InputSignal<string> = input.required<string>();
  buscador: BuscadorCaducidadesInterface | null = null;
  years: WritableSignal<InformeCaducidadesYearInterface[]> = signal<
    InformeCaducidadesYearInterface[]
  >([]);
  expandedItems: Set<string> = new Set<string>();
  totalUnidades: WritableSignal<number> = signal<number>(0);
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    try {
      const objStr: string = window.atob(this.data());
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
  }

  load(): void {
    this.is
      .getInformeCaducidades(this.buscador as BuscadorCaducidadesInterface)
      .subscribe((result: InformeCaducidadesResult): void => {
        this.years.set(result.data);
        this.totalUnidades.set(
          this.years().reduce(
            (sum: number, year: InformeCaducidadesYearInterface): number =>
              sum + year.totalUnidades,
            0
          )
        );
        this.totalPVP.set(
          this.years().reduce(
            (sum: number, year: InformeCaducidadesYearInterface): number => sum + year.totalPVP,
            0
          )
        );
        this.totalPUC.set(
          this.years().reduce(
            (sum: number, year: InformeCaducidadesYearInterface): number => sum + year.totalPUC,
            0
          )
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
