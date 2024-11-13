import { Component, inject, OnInit } from '@angular/core';
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
  standalone: true,
  imports: [FixedNumberPipe, MonthNamePipe],
  templateUrl: './caducidades-print.component.html',
  styleUrl: './caducidades-print.component.scss',
})
export default class CaducidadesPrintComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private is: InformesService = inject(InformesService);
  private cms: ClassMapperService = inject(ClassMapperService);

  buscador: BuscadorCaducidadesInterface | null = null;
  data: InformeCaducidadesYearInterface[] = [];

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
        console.log(this.data);
      });
  }
}
