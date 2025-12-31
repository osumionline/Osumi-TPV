import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { CierreCajaResult } from '@interfaces/caja.interface';
import { StatusResult } from '@interfaces/interfaces';
import CierreCaja from '@model/caja/cierre-caja.model';
import { DialogService } from '@osumi/angular-tools';
import { getCurrentDate } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.scss'],
  imports: [
    FormsModule,
    FixedNumberPipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
})
export default class CierreCajaComponent {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  public config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);
  private router: Router = inject(Router);

  cierreCaja: CierreCaja = new CierreCaja();
  showCoins: boolean = false;

  load(): void {
    const date: string = getCurrentDate();
    this.as.getCierreCaja(date).subscribe((result: CierreCajaResult): void => {
      this.cierreCaja = this.cms.getCierreCaja(result.datos);
    });
  }

  openCoins(): void {
    this.showCoins = !this.showCoins;
  }

  updateImporteReal(): void {
    this.cierreCaja.real =
      (this.cierreCaja.importe1c ?? 0) * 0.01 +
      (this.cierreCaja.importe2c ?? 0) * 0.02 +
      (this.cierreCaja.importe5c ?? 0) * 0.05 +
      (this.cierreCaja.importe10c ?? 0) * 0.1 +
      (this.cierreCaja.importe20c ?? 0) * 0.2 +
      (this.cierreCaja.importe50c ?? 0) * 0.5 +
      (this.cierreCaja.importe1 ?? 0) +
      (this.cierreCaja.importe2 ?? 0) * 2 +
      (this.cierreCaja.importe5 ?? 0) * 5 +
      (this.cierreCaja.importe10 ?? 0) * 10 +
      (this.cierreCaja.importe20 ?? 0) * 20 +
      (this.cierreCaja.importe50 ?? 0) * 50 +
      (this.cierreCaja.importe100 ?? 0) * 100 +
      (this.cierreCaja.importe200 ?? 0) * 200 +
      (this.cierreCaja.importe500 ?? 0) * 500;
  }

  cerrarCaja(): void {
    if (this.cierreCaja.real === null) {
      this.dialog.alert({
        title: 'Error',
        content: 'El campo "Importe real" es obligatorio.',
      });
      return;
    }

    if (this.cierreCaja.diferencia < 0) {
      this.dialog
        .confirm({
          title: 'Confirmar',
          content:
            'Atención, la diferencia de caja es negativa. ¿Estás seguro de querer continuar?',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.confirmCerrarCaja();
          }
        });
    } else {
      this.confirmCerrarCaja();
    }
  }

  confirmCerrarCaja(): void {
    this.as
      .saveCierreCaja(this.cierreCaja.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.config.isOpened = false;
          this.router.navigate(['/']);
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al realizar el cierre de caja.',
          });
        }
      });
  }
}
