import {
  Component,
  ElementRef,
  ModelSignal,
  Signal,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Month } from '@interfaces/interfaces';
import { MargenesModal } from '@interfaces/modals.interface';
import Articulo from '@model/articulos/articulo.model';
import IVAOption from '@model/tpv/iva-option.model';
import MargenesModalComponent from '@modules/articulos/components/modals/margenes-modal/margenes-modal.component';
import NewMarcaModalComponent from '@modules/articulos/components/modals/new-marca-modal/new-marca-modal.component';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import { getTwoNumberDecimal } from '@osumi/tools';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import NewProveedorModalComponent from '@shared/components/modals/new-proveedor-modal/new-proveedor-modal.component';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';
import { setTwoNumberDecimal } from '@shared/utils';

@Component({
  selector: 'otpv-un-articulo-general',
  imports: [
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatIconButton,
    MatIcon,
    MatSlideToggle,
    MatInput,
    FormsModule,
    FixedNumberPipe,
  ],
  templateUrl: './un-articulo-general.component.html',
  styleUrls: ['./un-articulo-general.component.scss', '../un-articulo/un-articulo.component.scss'],
})
export default class UnArticuloGeneralComponent {
  public ms: MarcasService = inject(MarcasService);
  public ps: ProveedoresService = inject(ProveedoresService);
  private overlayService: OverlayService = inject(OverlayService);
  private config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);

  articulo: ModelSignal<Articulo> = model.required<Articulo>();
  tipoIva: string = this.config.tipoIva;
  ivaOptions: IVAOption[] = this.config.ivaOptions;
  ivaList: number[] = this.ivaOptions.map((x: IVAOption): number => {
    return x.iva;
  });
  reList: number[] = this.ivaOptions.map((x: IVAOption): number => {
    return x.re;
  });
  marginList: number[] = this.config.marginList;
  mostrarWeb: boolean = this.config.ventaOnline;
  mostrarCaducidad: boolean = this.config.fechaCad;
  fecCad: string = null;
  fecCadEdit: boolean = false;
  fecCadValue: Signal<ElementRef> = viewChild<ElementRef>('fecCadValue');

  newMarca(): void {
    const modalnewMarcaData: Modal = {
      modalTitle: 'Nueva marca',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(NewMarcaModalComponent, modalnewMarcaData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null) {
        this.articulo.update((value: Articulo): Articulo => {
          value.idMarca = data.data;
          return value;
        });
      }
    });
  }

  openProveedor(): void {
    const modalnewProveedorData: Modal = {
      modalTitle: 'Nuevo proveedor',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(NewProveedorModalComponent, modalnewProveedorData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.articulo.update((value: Articulo): Articulo => {
          value.idProveedor = data.data;
          return value;
        });
      }
    });
  }

  loadFecCad(): void {
    const fecCad: string[] = this.articulo().fechaCaducidad.split('/');
    const mes: Month = this.config.monthList.find(
      (x: Month): boolean => x.id === parseInt(fecCad[0])
    );

    this.fecCad = mes.name + ' 20' + fecCad[1];
    this.fecCadEdit = false;
  }

  updateIva(ev: string): void {
    const ind: number = this.ivaList.findIndex((x: number): boolean => x == parseInt(ev));
    this.articulo.update((value: Articulo): Articulo => {
      value.re = this.reList[ind];
      return value;
    });

    const ivare: number =
      (this.articulo().iva !== null ? this.articulo().iva : 0) +
      (this.articulo().re !== null ? this.articulo().re : 0);
    const puc: number = getTwoNumberDecimal(this.articulo().palb * (1 + ivare / 100));
    this.updatePuc(puc);
  }

  updateRe(ev: string): void {
    const ind: number = this.reList.findIndex((x: number): boolean => x == parseFloat(ev));
    this.articulo.update((value: Articulo): Articulo => {
      value.iva = this.ivaList[ind];
      return value;
    });

    const ivare: number =
      (this.articulo().iva !== null ? this.articulo().iva : 0) +
      (this.articulo().re !== null ? this.articulo().re : 0);
    const puc: number = getTwoNumberDecimal(this.articulo().palb * (1 + ivare / 100));
    this.updatePuc(puc);
  }

  editFecCad(): void {
    this.fecCadEdit = true;
    setTimeout((): void => {
      if (this.articulo().fechaCaducidad) {
        this.fecCadValue().nativeElement.select();
      } else {
        this.fecCadValue().nativeElement.focus();
      }
    }, 200);
  }

  validateFecCad(): boolean {
    const fecCadFormat = /[0-9][0-9]\/[0-9][0-9]/;
    return this.articulo().fechaCaducidad.match(fecCadFormat) !== null;
  }

  checkFecCad(ev: KeyboardEvent, blur: boolean = false): void {
    if (ev.key == 'Enter' || blur) {
      if (this.validateFecCad()) {
        const d = new Date();
        const checkFecCadStr: string[] = this.articulo().fechaCaducidad.split('/');
        const month = this.config.monthList.find(
          (x: Month): boolean => x.id === parseInt(checkFecCadStr[0])
        );
        const checkD = new Date(
          2000 + parseInt(checkFecCadStr[1]),
          parseInt(checkFecCadStr[0]) - 1,
          month.days,
          23,
          59,
          59
        );
        if (d.getTime() > checkD.getTime()) {
          this.dialog
            .alert({
              title: 'Error',
              content: 'La fecha introducida no puede ser inferior a la actual.',
            })
            .subscribe((): void => {
              setTimeout((): void => {
                this.fecCadValue().nativeElement.select();
              }, 200);
            });
          return;
        } else {
          this.loadFecCad();
        }
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content:
              'El formato de fecha introducido no es correcto: mm/aa, por ejemplo Mayo de 2023 sería "05/23".',
          })
          .subscribe((): void => {
            setTimeout((): void => {
              this.fecCadValue().nativeElement.select();
            }, 200);
          });
        return;
      }
    }
  }

  setTwoNumberDecimal(ev: Event): void {
    return setTwoNumberDecimal(ev);
  }

  updatePalb(): void {
    const ivare: number =
      (this.articulo().iva !== null ? this.articulo().iva : 0) +
      (this.articulo().re != -1 ? this.articulo().re : 0);
    const puc: number = getTwoNumberDecimal(this.articulo().palb * (1 + ivare / 100));
    this.updatePuc(puc);
  }

  updatePuc(puc: number = null): void {
    if (puc !== null) {
      this.articulo.update((value: Articulo): Articulo => {
        value.puc = puc;
        return value;
      });
    }

    this.updateMargen();
  }

  updateMargen(): void {
    if (
      this.articulo().puc !== null &&
      this.articulo().puc !== 0 &&
      this.articulo().pvp !== null &&
      this.articulo().pvp !== 0
    ) {
      this.articulo.update((value: Articulo): Articulo => {
        value.margen = ((value.pvp - value.puc) / value.pvp) * 100;
        return value;
      });
    } else {
      this.articulo.update((value: Articulo): Articulo => {
        value.margen = 0;
        return value;
      });
    }
  }

  changeDescuento(): void {
    if (!this.articulo().descuento) {
      this.articulo.update((value: Articulo): Articulo => {
        value.margenDescuento = null;
        value.pvpDescuento = null;
        value.porcentajeDescuento = null;
        return value;
      });
    }
  }

  updatePVPDescuento(): void {
    this.updateMargenDescuento();
    this.updatePorcentajeDescuento();
  }

  updateMargenDescuento(): void {
    if (
      this.articulo().puc !== null &&
      this.articulo().puc !== 0 &&
      this.articulo().pvpDescuento !== null &&
      this.articulo().pvpDescuento !== 0
    ) {
      this.articulo.update((value: Articulo): Articulo => {
        value.margenDescuento = ((value.pvpDescuento - value.puc) / value.pvpDescuento) * 100;
        const descuento: number = value.pvp - value.pvpDescuento;
        value.porcentajeDescuento = (descuento / value.pvp) * 100;
        value.pvpDescuento = value.pvp * ((100 - value.porcentajeDescuento) / 100);
        return value;
      });
    } else {
      this.articulo.update((value: Articulo): Articulo => {
        value.margenDescuento = null;
        value.porcentajeDescuento = null;
        value.pvpDescuento = null;
        return value;
      });
    }
  }

  updatePorcentajeDescuento(): void {
    if (this.articulo().puc !== null && this.articulo().puc !== 0) {
      this.articulo.update((value: Articulo): Articulo => {
        value.pvpDescuento = value.pvp * ((100 - value.porcentajeDescuento) / 100);
        value.margenDescuento = ((value.pvpDescuento - value.puc) / value.pvpDescuento) * 100;
        const descuento: number = value.pvp - value.pvpDescuento;
        value.porcentajeDescuento = getTwoNumberDecimal((descuento / value.pvp) * 100);
        return value;
      });
    } else {
      this.articulo.update((value: Articulo): Articulo => {
        value.margenDescuento = null;
        value.porcentajeDescuento = null;
        value.pvpDescuento = null;
        return value;
      });
    }
  }

  abrirMargenes(): void {
    const modalMargenesData: MargenesModal = {
      modalTitle: 'Márgenes',
      modalColor: 'blue',
      puc: this.articulo().puc,
      list: this.marginList,
    };
    const dialog = this.overlayService.open(MargenesModalComponent, modalMargenesData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.articulo.update((value: Articulo): Articulo => {
          value.margen = data.data;
          value.pvp = getTwoNumberDecimal((value.puc * 100) / (100 - data.data));
          return value;
        });
      }
    });
  }

  abrirMargenesDescuento(): void {
    const modalMargenesData: MargenesModal = {
      modalTitle: 'Márgenes',
      modalColor: 'blue',
      puc: this.articulo().puc,
      list: this.marginList,
    };
    const dialog = this.overlayService.open(MargenesModalComponent, modalMargenesData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.articulo.update((value: Articulo): Articulo => {
          value.margenDescuento = data.data;
          value.pvpDescuento = getTwoNumberDecimal((value.puc * 100) / (100 - data.data));
          const importeDescuento: number = value.pvp - value.pvpDescuento;
          value.porcentajeDescuento = getTwoNumberDecimal((importeDescuento / value.pvp) * -100);

          return value;
        });
      }
    });
  }
}
