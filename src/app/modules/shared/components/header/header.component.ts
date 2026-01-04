import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { CajaModal } from '@interfaces/modals.interface';
import CajaModalComponent from '@modules/caja/components/modals/caja-modal/caja-modal.component';
import { OverlayService } from '@osumi/angular-tools';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, MatToolbar, MatIcon],
  host: {
    'window:keydown': 'onKeyDown($event)',
  },
})
export default class HeaderComponent {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly router: Router = inject(Router);
  private readonly overlayService: OverlayService = inject(OverlayService);

  selectedOption: InputSignal<string> = input<string>('');
  title: WritableSignal<string> = signal<string>(this.config.nombre);

  onKeyDown(ev: KeyboardEvent): void {
    const options: string[] = ['F4', 'F5', 'F6', 'F7', 'F8', 'F9'];
    if (options.includes(ev.key)) {
      ev.preventDefault();
      this.goTo(ev.key);
    }
    if (ev.key === 'F10') {
      ev.preventDefault();
      this.abrirCaja('historico');
    }
    if (ev.key === 'F11') {
      ev.preventDefault();
      this.abrirCaja('salidas');
    }
  }

  goTo(where: string): void {
    const whereTo: Record<string, string> = {
      F4: '/ventas',
      F5: '/articulos',
      F6: '/compras',
      F7: '/clientes',
      F8: '/almacen',
      F9: '/gestion',
    };
    this.router.navigate([whereTo[where]]);
  }

  abrirCaja(option: string = 'historico'): void {
    const modalCajaData: CajaModal = {
      modalTitle: 'Caja',
      modalColor: 'blue',
      css: 'modal-wide',
      option: option,
    };
    this.overlayService.open(CajaModalComponent, modalCajaData);
  }
}
