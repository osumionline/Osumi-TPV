import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateValues, SalidaCajaInterface } from "src/app/interfaces/interfaces";
import { SalidaCaja } from "src/app/model/salida-caja.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-salidas-caja",
  templateUrl: "./salidas-caja.component.html",
  styleUrls: ["./salidas-caja.component.scss"],
})
export class SalidasCajaComponent {
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
    this.fecha = Utils.addDays(this.fecha, -1);
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha = Utils.addDays(this.fecha, 1);
    this.changeFecha();
  }

  changeFecha(): void {
    this.salidaCajaSelected = new SalidaCaja();
    const data: DateValues = {
      modo: "fecha",
      fecha: Utils.getDate(this.fecha),
      desde: null,
      hasta: null,
    };
    this.buscarSalidasCaja(data);
  }

  buscarPorRango(): void {
    if (this.rangoDesde.getTime() > this.rangoHasta.getTime()) {
      this.dialog
        .alert({
          title: "Error",
          content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }
    const data: DateValues = {
      modo: "rango",
      fecha: null,
      desde: Utils.getDate(this.rangoDesde),
      hasta: Utils.getDate(this.rangoHasta),
    };
    this.buscarSalidasCaja(data);
  }

  buscarSalidasCaja(data: DateValues): void {
    this.start = true;
    this.as.getSalidasCaja(data).subscribe((result) => {
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
    setTimeout(() => {
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
      .subscribe((result) => {
        this.dialog
          .alert({
            title: "Datos guardados",
            content:
              'Salida de caja con concepto "' +
              this.salidaCajaSelected.concepto +
              '" correctamente guardada.',
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.resetBusqueda();
          });
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
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteSalidaCaja();
        }
      });
  }

  confirmDeleteSalidaCaja(): void {
    this.as.deleteSalidaCaja(this.salidaCajaSelected.id).subscribe((result) => {
      this.dialog
        .alert({
          title: "Salida de caja borrada",
          content:
            'La salida de caja con concepto "' +
            this.salidaCajaSelected.concepto +
            '" ha sido correctamente borrada.',
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.resetBusqueda();
        });
    });
  }
}