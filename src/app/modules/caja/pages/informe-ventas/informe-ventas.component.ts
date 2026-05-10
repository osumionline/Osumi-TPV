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
import { Month } from '@app/interfaces/interfaces';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-informe-ventas',
  imports: [],
  templateUrl: './informe-ventas.component.html',
  styleUrl: './informe-ventas.component.scss',
})
export default class InformeVentasComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);

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
  }
}
