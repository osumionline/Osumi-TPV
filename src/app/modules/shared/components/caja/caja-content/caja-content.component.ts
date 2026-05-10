import {
  Component,
  InputSignal,
  OnInit,
  OutputEmitterRef,
  Signal,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import GenerarInformeComponent from '@modules/caja/components/generar-informe/generar-informe.component';
import ConfigService from '@services/config.service';
import CierreCajaComponent from '@shared/components/caja/cierre-caja/cierre-caja.component';
import HistoricoVentasComponent from '@shared/components/caja/historico-ventas/historico-ventas.component';
import SalidasCajaComponent from '@shared/components/caja/salidas-caja/salidas-caja.component';

@Component({
  selector: 'otpv-caja-content',
  templateUrl: './caja-content.component.html',
  styleUrls: [],
  imports: [
    FormsModule,
    HistoricoVentasComponent,
    SalidasCajaComponent,
    CierreCajaComponent,
    MatTabGroup,
    MatTab,
    GenerarInformeComponent,
  ],
})
export default class CajaContentComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);

  cerrarVentanaEvent: OutputEmitterRef<number> = output<number>();
  from: InputSignal<string> = input<string>('modal');
  cajaSelectedTab: number = 0;
  cajaTabs: Signal<MatTabGroup> = viewChild.required<MatTabGroup>('cajaTabs');

  historicoVentas: Signal<HistoricoVentasComponent> =
    viewChild.required<HistoricoVentasComponent>('historicoVentas');
  salidasCaja: Signal<SalidasCajaComponent> =
    viewChild.required<SalidasCajaComponent>('salidasCaja');
  cierreCaja: Signal<CierreCajaComponent> = viewChild.required<CierreCajaComponent>('cierreCaja');

  ngOnInit(): void {
    this.historicoVentas().changeFecha();
    this.salidasCaja().changeFecha();
    if (this.from() === 'tab') {
      this.cierreCaja().load();
    }
  }

  selectTab(option: string): void {
    if (option === 'historico') {
      this.cajaSelectedTab = 0;
    }
    if (option === 'salidas') {
      this.cajaSelectedTab = 1;
    }
    this.cajaTabs().realignInkBar();
  }

  checkCajaTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2 && this.from() === 'tab') {
      this.cierreCaja().load();
    }
  }

  newSalidaCaja(ev: boolean): void {
    if (ev === true) {
      this.cierreCaja().load();
    }
  }

  cerrarCaja(): void {
    this.cerrarVentanaEvent.emit(0);
  }
}
