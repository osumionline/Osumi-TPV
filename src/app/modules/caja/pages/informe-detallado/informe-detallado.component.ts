import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { InformeMensualResult } from '@interfaces/informes.interface';
import InformesService from '@services/informes.service';

@Component({
  selector: 'otpv-informe-detallado',
  templateUrl: './informe-detallado.component.html',
  styleUrls: ['./informe-detallado.component.scss'],
})
export default class InformeDetalladoComponent implements OnInit {
  private is: InformesService = inject(InformesService);

  loaded: boolean = false;
  year: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  month: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    this.is
      .getInformeDetallado(this.month(), this.year())
      .subscribe((result: InformeMensualResult): void => {
        console.log(result);
      });
  }
}
