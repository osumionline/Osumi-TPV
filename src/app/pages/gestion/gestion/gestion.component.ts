import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Empleado } from "src/app/model/empleado.model";
import { DialogService } from "src/app/services/dialog.service";
import { GestionService } from "src/app/services/gestion.service";
import { rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-gestion",
  templateUrl: "./gestion.component.html",
  styleUrls: ["./gestion.component.scss"],
})
export class GestionComponent implements OnInit {
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
      this.router.navigate(["/installation"]);
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
      this.gs.empleado = this.empleado;
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

  selectMarcas(): void {
    if (
      this.empleado.hasAnyRol([
        rolList.marca.roles["crear"].id,
        rolList.marca.roles["modificar"].id,
        rolList.marca.roles["borrar"].id,
        rolList.marca.roles["estadisticas"].id,
      ])
    ) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/marcas"]);
    } else {
      this.dialog
        .alert({
          title: "Atención",
          content: 'No tienes permisos para acceder a la opción "Marcas"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    }
  }

  selectProveedores(): void {
    if (
      this.empleado.hasAnyRol([
        rolList.proveedor.roles["crear"].id,
        rolList.proveedor.roles["modificar"].id,
        rolList.proveedor.roles["borrar"].id,
        rolList.proveedor.roles["estadisticas"].id,
      ])
    ) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/proveedores"]);
    } else {
      this.dialog
        .alert({
          title: "Atención",
          content: 'No tienes permisos para acceder a la opción "Proveedores"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    }
  }

  selectTiposPago(): void {
    if (this.empleado.hasRol(rolList.gestion.roles["tiposPago"].id)) {
      this.gs.empleado = this.empleado;
      this.router.navigate(["/gestion/tipos-pago"]);
    } else {
      this.dialog
        .alert({
          title: "Atención",
          content:
            'No tienes permisos para acceder a la opción "Tipos de pago"',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    }
  }
}
