import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { disabled, form, FormField, min, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { VentaVariosInterface } from '@interfaces/venta.interface';
import IVAOption from '@model/tpv/iva-option.model';
import { CustomOverlayRef } from '@osumi/angular-tools';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-venta-varios-modal',
  templateUrl: './venta-varios-modal.component.html',
  imports: [MatFormField, MatInput, MatSelect, MatOption, MatButton, MatIcon, FormField],
})
export default class VentaVariosModalComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly customOverlayRef: CustomOverlayRef<
    null,
    { nombre: string; pvp: number; iva: number }
  > = inject(CustomOverlayRef);

  ivaList: number[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  sending: WritableSignal<boolean> = signal<boolean>(false);
  model: WritableSignal<VentaVariosInterface> = signal<VentaVariosInterface>({
    nombre: '',
    pvp: 0,
    iva: 21,
  });
  variosForm = form(this.model, (p) => {
    required(p.nombre);
    required(p.pvp);
    required(p.iva);
    min(p.pvp, 0);
    min(p.iva, 0);
    disabled(p.nombre, (): boolean => this.sending());
    disabled(p.pvp, (): boolean => this.sending());
    disabled(p.iva, (): boolean => this.sending());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.variosForm.nombre().errors().length === 0 &&
      this.variosForm.pvp().errors().length === 0 &&
      this.variosForm.iva().errors().length === 0
  );
  variosPVPbox: Signal<ElementRef> = viewChild.required<ElementRef>('variosPVPbox');

  ngOnInit(): void {
    for (const ivaOption of this.config.ivaOptions) {
      this.ivaList.push(ivaOption.iva);
    }
    this.model.update((): VentaVariosInterface => {
      return {
        nombre: this.customOverlayRef.data.nombre,
        pvp: this.customOverlayRef.data.pvp,
        iva: this.customOverlayRef.data.iva,
      };
    });
    setTimeout((): void => {
      this.variosPVPbox().nativeElement.focus();
    }, 0);
  }

  actualizarVarios(): void {
    this.sending.set(true);
    this.customOverlayRef.close(this.model());
  }
}
