import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { Empleado } from "src/app/model/empleado.model";
import { ConfigService } from "src/app/services/config.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadoSaveInterface } from "src/app/interfaces/interfaces";

@Component({
  selector: "otpv-gestion-empleados",
  templateUrl: "./gestion-empleados.component.html",
  styleUrls: ["./gestion-empleados.component.scss"],
})
export class GestionEmpleadosComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  @ViewChild("empleadoTabs", { static: false })
  empleadoTabs: MatTabGroup;
  selectedEmpleado: Empleado = new Empleado();

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    hasPassword: new FormControl(false),
    password: new FormControl(null),
    confirmPassword: new FormControl(null),
    color: new FormControl(null),
  });
  originalValue: EmpleadoSaveInterface = null;

  constructor(
    public es: EmpleadosService,
	public config: ConfigService,
	private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.config.start();
    this.es.load();
  }

  selectEmpleado(empleado: Empleado): void {
    this.start = false;
    this.selectedEmpleado = empleado;
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
	this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
  }

  newEmpleado(): void {
    this.start = false;
    this.selectedEmpleado = new Empleado();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
	this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
  }

  onSubmit(): void {
    console.log(this.form.value);
	if (
		this.form.value.hasPassword &&
		!this.originalValue.hasPassword &&
		(
			this.form.value.password === null ||
			this.form.value.password === '' ||
			this.form.value.confirmPassword === null ||
			this.form.value.password === ''
		)
	) {
		this.dialog
          .alert({
            title: "Error",
            content:
              'El empleado "' + this.form.value.nombre + '" originalmente no tenía contraseña pero ahora has indicado que si debe tener, de modo que no puedes dejar la contraseña en blanco.',
            ok: "Continuar",
          })
          .subscribe((result) => {});
		return;
	}

	if (
		this.form.value.hasPassword &&
		this.form.value.password !== this.form.value.confirmPassword
	) {
		this.dialog
          .alert({
            title: "Error",
            content:
              'Las contraseñas introducidas no coinciden.',
            ok: "Continuar",
          })
          .subscribe((result) => {});
		return;
	}

	this.selectedEmpleado.fromInterface(this.form.value, false);
	this.es.saveEmpleado(this.form.value).subscribe(result => {
		this.es.resetEmpleados();
        this.resetForm();
        this.dialog
          .alert({
            title: "Datos guardados",
            content:
              'Los datos del empleado "' +
              this.selectedEmpleado.nombre +
              '" han sido correctamente guardados.',
            ok: "Continuar",
          })
          .subscribe((result) => {});
	});
  }

  deleteEmpleado(): void {}
}
