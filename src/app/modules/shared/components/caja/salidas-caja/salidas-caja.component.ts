import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { addDays, getDate } from "@osumi/tools";
import {
  SalidaCajaInterface,
  SalidaCajaResult,
} from "src/app/interfaces/caja.interface";
import { DateValues, StatusResult } from "src/app/interfaces/interfaces";
import { SalidaCaja } from "src/app/model/caja/salida-caja.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-salidas-caja",
  templateUrl: "./salidas-caja.component.html",
  styleUrls: ["./salidas-caja.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FixedNumberPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
  ],
})
export class SalidasCajaComponent {
  @Output() salidaCajaEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  salidasModo: "fecha" | "rango" = "fecha";
  fecha: Date = new Date();
  rangoDesde: Date = new Date();
  rangoHasta: Date = new Date();

  salidasCajaList: SalidaCaja[] = [];
  salidaCajaSelected: SalidaCaja = new SalidaCaja();

  start: boolean = true;

  @ViewChild("conceptoBox", { static: true }) conceptoBox: ElementRef;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    concepto: new FormControl(null, Validators.required),
    descripcion: new FormControl(null),
    importe: new FormControl(null, Validators.required),
  });
  originalValue: SalidaCajaInterface = null;

  constructor(
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {}

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
      modo: "fecha",
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
        title: "Error",
        content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
        ok: "Continuar",
      });
      return;
    }
    const data: DateValues = {
      modo: "rango",
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
    if (this.salidasModo === "fecha") {
      this.fecha = new Date();
      this.changeFecha();
    }
    if (this.salidasModo === "rango") {
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
        if (result.status === "ok") {
          this.dialog
            .alert({
              title: "Datos guardados",
              content:
                'Salida de caja con concepto "' +
                this.salidaCajaSelected.concepto +
                '" correctamente guardada.',
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.resetBusqueda();
              this.salidaCajaEvent.emit(true);
            });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al guardar la salida de caja.",
            ok: "Continuar",
          });
        }
      });
  }

  deleteSalidaCaja(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar la salida de caja con concepto "' +
          this.salidaCajaSelected.concepto +
          '"?',
        ok: "Continuar",
        cancel: "Cancelar",
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
        if (result.status === "ok") {
          this.dialog
            .alert({
              title: "Salida de caja borrada",
              content:
                'La salida de caja con concepto "' +
                this.salidaCajaSelected.concepto +
                '" ha sido correctamente borrada.',
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.resetBusqueda();
            });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Error al borrar la salida de caja.",
            ok: "Continuar",
          });
        }
      });
  }
}
