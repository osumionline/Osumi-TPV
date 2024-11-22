import { Component, ModelSignal, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  ChartDataInterface,
  ChartResultInterface,
  ChartSelectInterface,
} from '@interfaces/articulo.interface';
import { Month } from '@interfaces/interfaces';
import Articulo from '@model/articulos/articulo.model';
import ArticulosService from '@services/articulos.service';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-un-articulo-estadisticas',
  imports: [MatFormField, MatSelect, MatOption, FormsModule],
  templateUrl: './un-articulo-estadisticas.component.html',
  styleUrl: '../un-articulo/un-articulo.component.scss',
})
export default class UnArticuloEstadisticasComponent {
  private config: ConfigService = inject(ConfigService);
  private ars: ArticulosService = inject(ArticulosService);

  articulo: ModelSignal<Articulo> = model.required<Articulo>();
  monthList: Month[] = this.config.monthList;
  statsVentas: ChartSelectInterface = {
    data: 'ventas',
    type: 'units',
    month: -1,
    year: -1,
  };
  statsVentasData: ChartDataInterface[] = [];
  statsWeb: ChartSelectInterface = {
    data: 'web',
    type: 'units',
    month: -1,
    year: -1,
  };
  statsYearList: number[] = [];
  statsWebData: ChartDataInterface[] = [];

  loadStatsVentas(): void {
    this.ars
      .getStatistics(this.statsVentas)
      .subscribe((result: ChartResultInterface): void => {
        this.statsVentasData = result.data;
      });
  }

  loadStatsWeb(): void {
    this.ars
      .getStatistics(this.statsWeb)
      .subscribe((result: ChartResultInterface): void => {
        this.statsWebData = result.data;
      });
  }
}
