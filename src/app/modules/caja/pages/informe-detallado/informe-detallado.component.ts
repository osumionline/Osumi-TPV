import {
  AfterViewInit,
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  InformeDetalladoArticuloInterface,
  InformeDetalladoMarcaInterface,
  InformeDetalladoResult,
} from '@interfaces/informes.interface';
import { Month } from '@interfaces/interfaces';
import ConfigService from '@services/config.service';
import InformesService from '@services/informes.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-informe-detallado',
  templateUrl: './informe-detallado.component.html',
  styleUrls: ['./informe-detallado.component.scss'],
  imports: [FixedNumberPipe, MatTableModule, MatIcon, MatSortModule],
})
export default class InformeDetalladoComponent
  implements OnInit, AfterViewInit
{
  private is: InformesService = inject(InformesService);
  private config: ConfigService = inject(ConfigService);

  loaded: WritableSignal<boolean> = signal<boolean>(false);
  year: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  month: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  monthName: WritableSignal<string> = signal<string>('');

  marcasDisplayedColumns: string[] = [
    'marca',
    'total_ventas_pvp',
    'total_beneficio',
    'margen',
    'margen_diferencia',
    'porcentaje_sobre_total',
  ];
  marcasDataSource: MatTableDataSource<InformeDetalladoMarcaInterface> =
    new MatTableDataSource<InformeDetalladoMarcaInterface>();
  marcasSort: Signal<MatSort> = viewChild('marcasSort');

  tmTotalVentasPVP: WritableSignal<number> = signal<number>(0);
  tmTotalBeneficio: WritableSignal<number> = signal<number>(0);
  tmMediaMargenBeneficio: WritableSignal<number> = signal<number>(0);

  articulosDisplayedColumns: string[] = [
    'marca',
    'nombre',
    'total_unidades_vendidas',
    'total_ventas_pvp',
    'total_beneficio',
    'margen_diferencia',
    'porcentaje_en_ventas',
  ];
  articulosDataSource: MatTableDataSource<InformeDetalladoArticuloInterface> =
    new MatTableDataSource<InformeDetalladoArticuloInterface>();
  articulosSort: Signal<MatSort> = viewChild('articulosSort');

  taTotalUnidadesVendidas: WritableSignal<number> = signal<number>(0);
  taTotalVentasPVP: WritableSignal<number> = signal<number>(0);
  taTotalBeneficio: WritableSignal<number> = signal<number>(0);

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    const indMonth: number = this.config.monthList.findIndex(
      (x: Month): boolean => {
        return x.id === this.month();
      }
    );
    this.monthName.set(this.config.monthList[indMonth].name);

    this.is
      .getInformeDetallado(this.month(), this.year())
      .subscribe((result: InformeDetalladoResult): void => {
        // Marcas
        const marcas: InformeDetalladoMarcaInterface[] = result.data.marcas;
        for (const item of marcas) {
          this.tmTotalVentasPVP.update((x) => x + item.total_ventas_pvp);
          this.tmTotalBeneficio.update((x) => x + item.total_beneficio);
          this.tmMediaMargenBeneficio.update((x) => x + item.margen);
        }
        this.tmMediaMargenBeneficio.update((x) => x / marcas.length);
        this.marcasDataSource.data = marcas;

        // Artículos
        const articulos: InformeDetalladoArticuloInterface[] =
          result.data.articulos;
        for (const item of articulos) {
          this.taTotalUnidadesVendidas.update(
            (x) => x + item.total_unidades_vendidas
          );
          this.taTotalVentasPVP.update((x) => x + item.total_ventas_pvp);
          this.taTotalBeneficio.update((x) => x + item.total_beneficio);
        }
        this.articulosDataSource.data = articulos;
        this.loaded.set(true);
      });
  }

  ngAfterViewInit(): void {
    this.marcasDataSource.sort = this.marcasSort();
    this.articulosDataSource.sort = this.articulosSort();
  }
}
