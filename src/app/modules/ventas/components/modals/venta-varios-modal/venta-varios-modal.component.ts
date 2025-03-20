import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import IVAOption from '@model/tpv/iva-option.model';
import { CustomOverlayRef } from '@osumi/angular-tools';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-venta-varios-modal',
  templateUrl: './venta-varios-modal.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatIcon,
  ],
})
export default class VentaVariosModalComponent implements OnInit {
  private config: ConfigService = inject(ConfigService);
  private customOverlayRef: CustomOverlayRef<
    null,
    { nombre: string; pvp: number; iva: number; re: number }
  > = inject(CustomOverlayRef);

  ivaList: number[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  formVarios: FormGroup = new FormGroup({
    nombre: new FormControl<string>(null, Validators.required),
    pvp: new FormControl<number>(null, Validators.required),
    iva: new FormControl<number>(21, Validators.required),
  });
  variosPVPbox: Signal<ElementRef> =
    viewChild.required<ElementRef>('variosPVPbox');

  ngOnInit(): void {
    for (const ivaOption of this.config.ivaOptions) {
      this.ivaList.push(ivaOption.iva);
    }
    this.formVarios.get('nombre').setValue(this.customOverlayRef.data.nombre);
    this.formVarios.get('pvp').setValue(this.customOverlayRef.data.pvp);
    this.formVarios.get('iva').setValue(this.customOverlayRef.data.iva);
    setTimeout((): void => {
      this.variosPVPbox().nativeElement.focus();
    }, 0);
  }

  actualizarVarios(): void {
    this.customOverlayRef.close({
      nombre: this.formVarios.get('nombre').value,
      pvp: this.formVarios.get('pvp').value,
      iva: this.formVarios.get('iva').value,
    });
  }
}
