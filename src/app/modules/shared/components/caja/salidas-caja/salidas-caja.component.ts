import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  OutputEmitterRef,
  ViewChild,
  inject,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import {
  SalidaCajaInterface,
  SalidaCajaResult,
} from '@interfaces/caja.interface';
import { DateValues, StatusResult } from '@interfaces/interfaces';
import SalidaCaja from '@model/caja/salida-caja.model';
import { DialogService } from '@osumi/angular-tools';
import { addDays, getDate } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  standalone: true,
  selector: 'otpv-salidas-caja',
  templateUrl: './salidas-caja.component.html',
  styleUrls: ['./salidas-caja.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    FixedNumberPipe,
    MatFormFieldModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCard,
    MatCardContent,
    MatActionList,
    MatListItem,
  ],
})
export default class SalidasCajaComponent {
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  salidaCajaEvent: OutputEmitterRef<boolean> = output<boolean>();
  salidasModo: 'fecha' | 'rango' = 'fecha';
  fecha: Date = new Date();
  rangoDesde: Date = new Date();
  rangoHasta: Date = new Date();

  salidasCajaList: SalidaCaja[] = [];
  salidaCajaSelected: SalidaCaja = new SalidaCaja();

  start: boolean = true;

  @ViewChild('conceptoBox', { static: true }) conceptoBox: ElementRef;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    concepto: new FormControl(null, Validators.required),
    descripcion: new FormControl(null),
    importe: new FormControl(null, Validators.required),
  });
  originalValue: SalidaCajaInterface = null;

  previousFecha(): void {
    this.fecha = addDays(this.fecha, -1);
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha = addDays(this.fecha, 1);
    this.changeFecha();
  }

  changeFecha(): void {
    this.salidaCajaSelected = new SalidaCaja();
    const data: DateValues = {
      modo: 'fecha',
      id: null,
      fecha: getDate(this.fecha),
      desde: null,
      hasta: null,
    };
    this.buscarSalidasCaja(data);
  }

  buscarPorRango(): void {
    if (this.rangoDesde.getTime() > this.rangoHasta.getTime()) {
      this.dialog.alert({
        title: 'Error',
        content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
        ok: 'Continuar',
      });
      return;
    }
    const data: DateValues = {
      modo: 'rango',
      fecha: null,
      id: null,
      desde: getDate(this.rangoDesde),
      hasta: getDate(this.rangoHasta),
    };
    this.buscarSalidasCaja(data);
  }

  buscarSalidasCaja(data: DateValues): void {
    this.start = true;
    this.as.getSalidasCaja(data).subscribe((result: SalidaCajaResult): void => {
      this.salidasCajaList = this.cms.getSalidasCaja(result.list);
    });
  }

  selectSalidaCaja(salidaCaja: SalidaCaja): void {
    this.start = false;
    this.salidaCajaSelected = salidaCaja;
    this.form.patchValue(this.salidaCajaSelected.toInterface(false));
    this.originalValue = this.form.getRawValue();
  }

  newSalidaCaja(): void {
    this.start = false;
    this.salidaCajaSelected = new SalidaCaja();
    this.form.patchValue(this.salidaCajaSelected.toInterface(false));
    this.originalValue = this.form.getRawValue();
    setTimeout((): void => {
      this.conceptoBox.nativeElement.focus();
    }, 0);
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.salidaCajaSelected.toInterface(false));
  }

  resetBusqueda(): void {
    if (this.salidasModo === 'fecha') {
      this.fecha = new Date();
      this.changeFecha();
    }
    if (this.salidasModo === 'rango') {
      this.rangoDesde = new Date();
      this.rangoHasta = new Date();
      this.buscarPorRango();
    }
  }

  onSubmit(): void {
    const data: SalidaCajaInterface = JSON.parse(
      JSON.stringify(this.form.value)
    );

    this.salidaCajaSelected.fromInterface(data, false);
    this.as
      .saveSalidaCaja(this.salidaCajaSelected.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.dialog
            .alert({
              title: 'Datos guardados',
              content:
                'Salida de caja con concepto "' +
                this.salidaCajaSelected.concepto +
                '" correctamente guardada.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.resetBusqueda();
              this.salidaCajaEvent.emit(true);
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar la salida de caja.',
            ok: 'Continuar',
          });
        }
      });
  }

  deleteSalidaCaja(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar la salida de caja con concepto "' +
          this.salidaCajaSelected.concepto +
          '"?',
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteSalidaCaja();
        }
      });
  }

  confirmDeleteSalidaCaja(): void {
    this.as
      .deleteSalidaCaja(this.salidaCajaSelected.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.dialog
            .alert({
              title: 'Salida de caja borrada',
              content:
                'La salida de caja con concepto "' +
                this.salidaCajaSelected.concepto +
                '" ha sido correctamente borrada.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.resetBusqueda();
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Error al borrar la salida de caja.',
            ok: 'Continuar',
          });
        }
      });
  }
}
