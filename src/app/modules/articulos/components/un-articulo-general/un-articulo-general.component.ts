import {
  Component,
  ElementRef,
  ModelSignal,
  Signal,
  WritableSignal,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CategoriaInterface } from '@interfaces/articulo.interface';
import { Month } from '@interfaces/interfaces';
import {
  MargenesModal,
  MargenesModalResult,
  NewMarcaModalResult,
  NewProveedorModalResult,
} from '@interfaces/modals.interface';
import Articulo from '@model/articulos/articulo.model';
import Marca from '@model/marcas/marca.model';
import Proveedor from '@model/proveedores/proveedor.model';
import IVAOption from '@model/tpv/iva-option.model';
import MargenesModalComponent from '@modules/articulos/modals/margenes-modal/margenes-modal.component';
import NewMarcaModalComponent from '@modules/articulos/modals/new-marca-modal/new-marca-modal.component';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import { getTwoNumberDecimal } from '@osumi/tools';
import CategoriasService from '@services/categorias.service';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import NewProveedorModalComponent from '@shared/modals/new-proveedor-modal/new-proveedor-modal.component';
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
    MatTooltip,
    FormsModule,
    FixedNumberPipe,
    RouterLink,
  ],
  templateUrl: './un-articulo-general.component.html',
  styleUrls: ['./un-articulo-general.component.scss', '../un-articulo/un-articulo.component.scss'],
})
export default class UnArticuloGeneralComponent {
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly ps: ProveedoresService = inject(ProveedoresService);
  private readonly cs: CategoriasService = inject(CategoriasService);
  private readonly overlayService: OverlayService = inject(OverlayService);
  private readonly config: ConfigService = inject(ConfigService);
  private readonly dialog: DialogService = inject(DialogService);

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
  fecCad: string | null = null;
  fecCadEdit: boolean = false;
  fecCadValue: Signal<ElementRef> = viewChild.required<ElementRef>('fecCadValue');

  marcas: Marca[] = this.ms.marcas();
  btnNewMarca: Signal<MatIconButton> = viewChild.required<MatIconButton>('btnNewMarca');
  proveedores: Proveedor[] = this.ps.proveedores();
  btnNewProveedor: Signal<MatIconButton> = viewChild.required<MatIconButton>('btnNewProveedor');

  categoriesPlain: WritableSignal<CategoriaInterface[]> = signal<CategoriaInterface[]>(
    this.cs.categoriasPlain,
  );

  newMarca(): void {
    const modalnewMarcaData: Modal = {
      modalTitle: 'Nueva marca',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open<NewMarcaModalResult>(
      NewMarcaModalComponent,
      modalnewMarcaData,
      [],
      true,
      this.btnNewMarca()._elementRef.nativeElement,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null && data.data !== null && data.data.result !== null) {
        const marca: Marca = data.data.result;
        this.marcas.push(marca);
        this.marcas.sort((a: Marca, b: Marca): number => a.nombre!.localeCompare(b.nombre!));
        this.articulo.update((value: Articulo): Articulo => {
          value.idMarca = marca.id;
          return this.cloneArticulo(value);
        });
      }
    });
  }

  openProveedor(): void {
    const modalnewProveedorData: Modal = {
      modalTitle: 'Nuevo proveedor',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open<NewProveedorModalResult>(
      NewProveedorModalComponent,
      modalnewProveedorData,
      [],
      true,
      this.btnNewProveedor()._elementRef.nativeElement,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null && data.data !== null && data.data.result !== null) {
        const proveedor: Proveedor = data.data.result;
        this.proveedores.push(proveedor);
        this.proveedores.sort((a: Proveedor, b: Proveedor): number =>
          a.nombre!.localeCompare(b.nombre!),
        );
        this.articulo.update((value: Articulo): Articulo => {
          if (data.data !== null) {
            value.idProveedor = proveedor.id;
          }
          return this.cloneArticulo(value);
        });
      }
    });
  }

  loadFecCad(): void {
    const fechaCaducidad: string | null = this.articulo().fechaCaducidad;
    if (fechaCaducidad !== null && fechaCaducidad !== '') {
      const fecCad: string[] = fechaCaducidad.split('/');
      const mes: Month | undefined = this.config.monthList.find(
        (x: Month): boolean => x.id === parseInt(fecCad[0]),
      );

      if (mes !== undefined) {
        this.fecCad = mes.name + ' 20' + fecCad[1];
        this.fecCadEdit = false;
      }
    } else {
      this.fecCad = null;
      this.fecCadEdit = false;
    }
  }

  updateIva(ev: number | string): void {
    const ind: number = this.ivaList.findIndex((x: number): boolean => x === parseInt(String(ev)));
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

  updateRe(ev: number | string): void {
    const ind: number = this.reList.findIndex((x: number): boolean => x === parseFloat(String(ev)));
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
    const fecCadFormat = /^(0[1-9]|1[0-2])\/[0-9][0-9]$/;
    return (this.articulo().fechaCaducidad ?? '').trim().match(fecCadFormat) !== null;
  }

  checkFecCad(): void {
    const fechaCaducidad: string = (this.articulo().fechaCaducidad ?? '').trim();
    if (fechaCaducidad === '') {
      this.articulo.update((value: Articulo): Articulo => {
        value.fechaCaducidad = null;
        return value;
      });
      this.loadFecCad();
      return;
    }

    if (this.validateFecCad()) {
      const d = new Date();
      const checkFecCadStr: string[] = fechaCaducidad.split('/');
      const month: Month | undefined = this.config.monthList.find(
        (x: Month): boolean => x.id === parseInt(checkFecCadStr[0]),
      );
      if (month === undefined) {
        this.showFecCadFormatError();
        return;
      }

      const checkD = new Date(
        2000 + parseInt(checkFecCadStr[1]),
        parseInt(checkFecCadStr[0]) - 1,
        month.days!,
        23,
        59,
        59,
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

  setTwoNumberDecimal(ev: Event): void {
    return setTwoNumberDecimal(ev);
  }

  updatePalb(palb?: number | null): void {
    if (palb !== undefined) {
      this.articulo.update((value: Articulo): Articulo => {
        value.palb = palb ?? 0;
        return value;
      });
    }

    const ivare: number =
      (this.articulo().iva !== null ? this.articulo().iva : 0) +
      (this.articulo().re != -1 ? this.articulo().re : 0);
    const puc: number = getTwoNumberDecimal(this.articulo().palb * (1 + ivare / 100));
    this.updatePuc(puc);
  }

  updatePuc(puc?: number | null): void {
    if (puc !== undefined) {
      this.articulo.update((value: Articulo): Articulo => {
        value.puc = puc ?? 0;
        return value;
      });
    }

    this.updateMargen();
  }

  updateMargen(pvp?: number | null): void {
    if (pvp !== undefined) {
      this.articulo.update((value: Articulo): Articulo => {
        value.pvp = pvp;
        return value;
      });
    }

    if (
      this.articulo().puc !== null &&
      this.articulo().puc !== 0 &&
      this.articulo().pvp !== null &&
      this.articulo().pvp !== 0
    ) {
      this.articulo.update((value: Articulo): Articulo => {
        value.margen = (((value.pvp ?? 0) - value.puc) / (value.pvp ?? 1)) * 100;
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

  updatePVPDescuento(pvpDescuento?: number | null): void {
    this.articulo.update((value: Articulo): Articulo => {
      if (pvpDescuento !== undefined) {
        value.pvpDescuento = pvpDescuento;
      }

      const pvp: number = value.pvp ?? 0;
      const pvpDescuentoValue: number = value.pvpDescuento ?? 0;

      if (pvp <= 0 || value.pvpDescuento === null) {
        value.margenDescuento = null;
        value.porcentajeDescuento = null;
        return this.cloneArticulo(value);
      }

      const descuento: number = pvp - pvpDescuentoValue;
      value.porcentajeDescuento = getTwoNumberDecimal((descuento / pvp) * 100);
      value.margenDescuento = this.getMargenDescuento(value.puc, pvpDescuentoValue);
      return this.cloneArticulo(value);
    });
  }

  updateMargenDescuento(): void {
    this.articulo.update((value: Articulo): Articulo => {
      const pvp: number = value.pvp ?? 0;
      const margenDescuento: number | null = value.margenDescuento;

      if (pvp <= 0 || value.puc === null || margenDescuento === null || margenDescuento >= 100) {
        value.margenDescuento = null;
        value.porcentajeDescuento = null;
        value.pvpDescuento = null;
        return this.cloneArticulo(value);
      }

      value.pvpDescuento = getTwoNumberDecimal((value.puc * 100) / (100 - margenDescuento));
      const descuento: number = pvp - value.pvpDescuento;
      value.porcentajeDescuento = getTwoNumberDecimal((descuento / pvp) * 100);
      return this.cloneArticulo(value);
    });
  }

  updatePorcentajeDescuento(porcentajeDescuento?: number | null): void {
    this.articulo.update((value: Articulo): Articulo => {
      if (porcentajeDescuento !== undefined) {
        value.porcentajeDescuento = porcentajeDescuento;
      }

      const pvp: number = value.pvp ?? 0;

      if (pvp <= 0 || value.porcentajeDescuento === null) {
        value.margenDescuento = null;
        value.porcentajeDescuento = null;
        value.pvpDescuento = null;
        return this.cloneArticulo(value);
      }

      value.porcentajeDescuento = this.clampPorcentajeDescuento(value.porcentajeDescuento);
      value.pvpDescuento = getTwoNumberDecimal(pvp * ((100 - value.porcentajeDescuento) / 100));
      value.margenDescuento = this.getMargenDescuento(value.puc, value.pvpDescuento);
      return this.cloneArticulo(value);
    });
  }

  abrirMargenes(): void {
    const modalMargenesData: MargenesModal = {
      modalTitle: 'Márgenes',
      modalColor: 'blue',
      puc: this.articulo().puc,
      list: this.marginList,
    };
    const dialog = this.overlayService.open<MargenesModalResult>(
      MargenesModalComponent,
      modalMargenesData,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null && data.data !== null) {
        this.articulo.update((value: Articulo): Articulo => {
          if (data.data !== null && data.data.result !== null) {
            value.margen = data.data.result;
            value.pvp = getTwoNumberDecimal((value.puc * 100) / (100 - data.data.result));
          }
          return this.cloneArticulo(value);
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
    const dialog = this.overlayService.open<MargenesModalResult>(
      MargenesModalComponent,
      modalMargenesData,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null && data.data !== null) {
        const result: number | null = data.data.result;
        if (result !== null) {
          setTimeout((): void => {
            this.updatePorcentajeDescuento(result);
          }, 0);
        }
      }
    });
  }

  private showFecCadFormatError(): void {
    this.dialog
      .alert({
        title: 'Error',
        content:
          'El formato de fecha introducido no es correcto: mm/aa, por ejemplo Mayo de 2023 serÃ­a "05/23".',
      })
      .subscribe((): void => {
        setTimeout((): void => {
          this.fecCadValue().nativeElement.select();
        }, 200);
      });
  }

  private getMargenDescuento(puc: number | null, pvpDescuento: number | null): number | null {
    if (puc === null || puc === 0 || pvpDescuento === null || pvpDescuento === 0) {
      return null;
    }

    return ((pvpDescuento - puc) / pvpDescuento) * 100;
  }

  private clampPorcentajeDescuento(porcentajeDescuento: number): number {
    return Math.min(Math.max(porcentajeDescuento, 0), 100);
  }

  private cloneArticulo(articulo: Articulo): Articulo {
    return Object.assign(new Articulo(), articulo);
  }
}
