import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Empleado } from "src/app/model/empleado.model";
import { DialogService } from "src/app/services/dialog.service";
import { rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-gestion",
  templateUrl: "./gestion.component.html",
  styleUrls: ["./gestion.component.scss"],
})
export class GestionComponent implements OnInit {
  empleado: Empleado = null;

  constructor(private router: Router, private dialog: DialogService) {}

  ngOnInit(): void {}

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
      this.router.navigate(["/gestion"]);
    } else {
      this.dialog
        .alert({
          title: "Atención",
          content:
            'No tienes permisos para acceder a la opción "Ajustes iniciales"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
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
      this.router.navigate(["/gestion/empleados"]);
    } else {
      this.dialog
        .alert({
          title: "Atención",
          content: 'No tienes permisos para acceder a la opción "Empleados"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    }
  }
}
