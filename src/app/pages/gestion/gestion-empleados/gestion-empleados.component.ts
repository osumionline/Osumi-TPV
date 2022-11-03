import { KeyValue } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { EmpleadoSaveInterface } from "src/app/interfaces/interfaces";
import { Empleado } from "src/app/model/empleado.model";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { GestionService } from "src/app/services/gestion.service";
import { Rol, RolGroup, rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-gestion-empleados",
  templateUrl: "./gestion-empleados.component.html",
  styleUrls: ["./gestion-empleados.component.scss"],
})
export class GestionEmpleadosComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  canNewEmployees: boolean = false;
  canDeleteEmployees: boolean = false;
  canModifyEmployees: boolean = false;
  canChangeEmployeeRoles: boolean = false;
  canSeeStatistics: boolean = false;
  canSaveChanges: boolean = false;
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

  list: {
    [key: string]: RolGroup;
  } = rolList;
  selectedRolList: boolean[] = [];

  constructor(
    public es: EmpleadosService,
    public config: ConfigService,
    private dialog: DialogService,
    private gs: GestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(["/gestion"]);
      return;
    }
    this.canNewEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles["crear"].id
    );
    this.canDeleteEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles["borrar"].id
    );
    this.canModifyEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles["modificar"].id
    );
    this.canChangeEmployeeRoles = this.gs.empleado.hasRol(
      rolList.empleados.roles["roles"].id
    );
    this.canSeeStatistics = this.gs.empleado.hasRol(
      rolList.empleados.roles["estadisticas"].id
    );
    for (let group in this.list) {
      for (let rol in this.list[group].roles) {
        this.selectedRolList[this.list[group].roles[rol].id] = false;
      }
    }
  }

  selectEmpleado(empleado: Empleado): void {
    this.start = false;
    this.selectedEmpleado = empleado;
    this.updateSelectedRolList();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
    this.updateEnabledDisabled("edit");
  }

  newEmpleado(): void {
    this.start = false;
    this.selectedEmpleado = new Empleado();
    this.updateSelectedRolList();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
    this.updateEnabledDisabled("new");
  }

  updateEnabledDisabled(operation: string): void {
    this.form.get("nombre")?.enable();
    this.form.get("hasPassword")?.enable();
    this.form.get("password")?.enable();
    this.form.get("confirmPassword")?.enable();
    this.form.get("color")?.enable();
    this.canSaveChanges = true;
    if (
      (operation === "new" && !this.canNewEmployees) ||
      (operation === "edit" && !this.canModifyEmployees)
    ) {
      this.form.get("nombre")?.disable();
      this.form.get("hasPassword")?.disable();
      this.form.get("password")?.disable();
      this.form.get("confirmPassword")?.disable();
      this.form.get("color")?.disable();
      this.canSaveChanges = false;
    }
    if (this.canChangeEmployeeRoles) {
      this.canSaveChanges = true;
    }
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.updateSelectedRolList();
  }

  updateSelectedRolList(): void {
    for (let i in this.selectedRolList) {
      this.selectedRolList[i] = false;
    }
    for (let i of this.selectedEmpleado.roles) {
      this.selectedRolList[i] = true;
    }
  }

  onSubmit(): void {
    if (
      this.form.value.hasPassword &&
      !this.originalValue.hasPassword &&
      (this.form.value.password === null ||
        this.form.value.password === "" ||
        this.form.value.confirmPassword === null ||
        this.form.value.password === "")
    ) {
      this.dialog
        .alert({
          title: "Error",
          content:
            'El empleado "' +
            this.form.value.nombre +
            '" originalmente no tenía contraseña pero ahora has indicado que si debe tener, de modo que no puedes dejar la contraseña en blanco.',
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
          content: "Las contraseñas introducidas no coinciden.",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }

    const roles: number[] = [];
    for (let i in this.selectedRolList) {
      if (this.selectedRolList[i] === true) {
        roles.push(parseInt(i));
      }
    }
    const data: EmpleadoSaveInterface = JSON.parse(
      JSON.stringify(this.form.value)
    );
    data.roles = roles;

    this.selectedEmpleado.fromInterface(data, false);
    this.es.saveEmpleado(data).subscribe((result) => {
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

  deleteEmpleado(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el empleado "' +
          this.selectedEmpleado.nombre +
          '"? Las ventas asociadas al empleado no se borrarán, pero dejarán de estar vinculadas a un empleado concreto.',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteEmpleado();
        }
      });
  }

  confirmDeleteEmpleado(): void {
    this.es.deleteEmpleado(this.selectedEmpleado.id).subscribe((result) => {
      this.es.resetEmpleados();
      this.start = true;
      this.dialog
        .alert({
          title: "Empleado borrado",
          content:
            'El empleado "' +
            this.selectedEmpleado.nombre +
            '" ha sido correctamente borrado.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    });
  }

  originalRolGroupOrder = (
    a: KeyValue<string, RolGroup>,
    b: KeyValue<string, RolGroup>
  ): number => {
    return 0;
  };

  originalRolOrder = (
    a: KeyValue<string, Rol>,
    b: KeyValue<string, Rol>
  ): number => {
    return 0;
  };
}
