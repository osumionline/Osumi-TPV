import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Empleado } from "@model/tpv/empleado.model";
import { DialogService } from "@services/dialog.service";
import { GestionService } from "@services/gestion.service";
import { EmployeeLoginComponent } from "@shared/components/employee-login/employee-login.component";
import { HeaderComponent } from "@shared/components/header/header.component";
import { rolList } from "@shared/rol.class";

@Component({
  standalone: true,
  selector: "otpv-gestion",
  templateUrl: "./gestion.component.html",
  styleUrls: ["./gestion.component.scss"],
  imports: [HeaderComponent, EmployeeLoginComponent, MatButton, MatIcon],
})
export default class GestionComponent implements OnInit {
  empleado: Empleado = null;

  constructor(
    private router: Router,
    private dialog: DialogService,
    private gs: GestionService
  ) {}

  ngOnInit(): void {
    if (this.gs.empleado) {
      this.empleado = this.gs.empleado;
    }
  }

  loginSuccess(ev: Empleado): void {
    this.empleado = ev;
  }

  logout(): void {
    this.empleado = null;
  }

  selectAjustes(): void {
    if (
      this.empleado.hasRol(
        rolList.gestion.roles["modificarAjustesIniciales"].id
      )
    ) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/installation"]);
    } else {
      this.dialog.alert({
        title: "Atención",
        content:
          'No tienes permisos para acceder a la opción "Ajustes iniciales"',
        ok: "Continuar",
      });
    }
  }

  selectEmpleados(): void {
    if (
      this.empleado.hasAnyRol([
        rolList.empleados.roles["crear"].id,
        rolList.empleados.roles["modificar"].id,
        rolList.empleados.roles["borrar"].id,
        rolList.empleados.roles["roles"].id,
        rolList.empleados.roles["estadisticas"].id,
      ])
    ) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/empleados"]);
    } else {
      this.dialog.alert({
        title: "Atención",
        content: 'No tienes permisos para acceder a la opción "Empleados"',
        ok: "Continuar",
      });
    }
  }

  selectTiposPago(): void {
    if (this.empleado.hasRol(rolList.gestion.roles["tiposPago"].id)) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/tipos-pago"]);
    } else {
      this.dialog.alert({
        title: "Atención",
        content: 'No tienes permisos para acceder a la opción "Tipos de pago"',
        ok: "Continuar",
      });
    }
  }

  selectBackup(): void {
    this.gs.empleado = this.empleado;
    this.router.navigate(["/gestion/backup"]);
  }
}
