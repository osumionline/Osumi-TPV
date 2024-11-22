import {
  Component,
  Input,
  OnInit,
  OutputEmitterRef,
  ViewChild,
  inject,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Month } from '@interfaces/interfaces';
import ConfigService from '@services/config.service';
import CierreCajaComponent from '@shared/components/caja/cierre-caja/cierre-caja.component';
import HistoricoVentasComponent from '@shared/components/caja/historico-ventas/historico-ventas.component';
import SalidasCajaComponent from '@shared/components/caja/salidas-caja/salidas-caja.component';

@Component({
  selector: 'otpv-caja-content',
  templateUrl: './caja-content.component.html',
  styleUrls: ['./caja-content.component.scss'],
  imports: [
    FormsModule,
    HistoricoVentasComponent,
    SalidasCajaComponent,
    CierreCajaComponent,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatSelect,
    MatOption,
    MatButton,
  ],
})
export default class CajaContentComponent implements OnInit {
  private config: ConfigService = inject(ConfigService);

  cerrarVentanaEvent: OutputEmitterRef<number> = output<number>();
  @Input() from: string = 'modal';
  cajaSelectedTab: number = 0;
  @ViewChild('cajaTabs', { static: false })
  cajaTabs: MatTabGroup;

  @ViewChild('historicoVentas', { static: true })
  historicoVentas: HistoricoVentasComponent;
  @ViewChild('salidasCaja', { static: true })
  salidasCaja: SalidasCajaComponent;
  @ViewChild('cierreCaja', { static: true })
  cierreCaja: CierreCajaComponent;

  informeTipo: string = null;
  monthList: Month[] = [];
  informeMonth: number = null;
  yearList: number[] = [];
  informeYear: number = null;

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const d: Date = new Date();
    for (let y: number = d.getFullYear(); y > d.getFullYear() - 5; y--) {
      this.yearList.push(y);
    }
    this.historicoVentas.changeFecha();
    this.salidasCaja.changeFecha();
    if (this.from === 'tab') {
      this.cierreCaja.load();
    }
  }

  selectTab(option: string): void {
    if (option === 'historico') {
      this.cajaSelectedTab = 0;
    }
    if (option === 'salidas') {
      this.cajaSelectedTab = 1;
    }
    this.cajaTabs.realignInkBar();
  }

  checkCajaTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2 && this.from === 'tab') {
      this.cierreCaja.load();
    }
  }

  newSalidaCaja(ev: boolean): void {
    if (ev === true) {
      this.cierreCaja.load();
    }
  }

  cerrarCaja(): void {
    this.cerrarVentanaEvent.emit(0);
  }

  generarInforme(): void {
    window.open(
      `/caja/informes/${this.informeTipo}/${this.informeYear}/${this.informeMonth}`
    );
  }
}
