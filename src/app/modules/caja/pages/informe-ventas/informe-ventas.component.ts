import { CommonModule, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  InformeVentasCategoriaInterface,
  InformeVentasResult,
} from '@app/interfaces/informes.interface';
import { Month } from '@app/interfaces/interfaces';
import ConfigService from '@services/config.service';
import InformesService from '@services/informes.service';

@Component({
  selector: 'otpv-informe-ventas',
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule, CurrencyPipe, CommonModule],
  templateUrl: './informe-ventas.component.html',
  styleUrl: './informe-ventas.component.scss',
})
export default class InformeVentasComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly is: InformesService = inject(InformesService);

  loaded: WritableSignal<boolean> = signal<boolean>(false);
  idCategoria: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  year: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  month: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  monthName: WritableSignal<string> = signal<string>('');
  data: WritableSignal<InformeVentasCategoriaInterface | null> =
    signal<InformeVentasCategoriaInterface | null>(null);

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    console.log({
      idCategoria: this.idCategoria(),
      year: this.year(),
      month: this.month(),
    });
    const indMonth: number = this.config.monthList.findIndex((x: Month): boolean => {
      return x.id === this.month();
    });
    this.monthName.set(this.config.monthList[indMonth].name);

    this.is
      .getInformeVentas(this.idCategoria(), this.month(), this.year())
      .subscribe((result: InformeVentasResult): void => {
        console.log(result);
        this.data.set(result.data);
      });
  }
}
