import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { Empleado } from "src/app/model/empleado.model";
import { ConfigService } from "src/app/services/config.service";
import { EmpleadosService } from "src/app/services/empleados.service";

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
    password: new FormControl({ value: null, disabled: true }),
    confirmPassword: new FormControl({ value: null, disabled: true }),
    color: new FormControl(null),
  });

  constructor(public es: EmpleadosService, public config: ConfigService) {}

  ngOnInit(): void {
    this.config.start();
    this.es.load();
  }

  selectEmpleado(empleado: Empleado): void {
    this.start = false;
    this.selectedEmpleado = empleado;
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.empleadoTabs.realignInkBar();
  }

  newEmpleado(): void {
    this.start = false;
    this.selectedEmpleado = new Empleado();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.empleadoTabs.realignInkBar();
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  deleteEmpleado(): void {}
}
