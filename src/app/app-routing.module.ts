import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { BackupComponent } from "src/app/pages/gestion/backup/backup.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { MainComponent } from "src/app/pages/main/main.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "installation", component: InstallationComponent },
  {
    path: "ventas",
    loadChildren: () =>
      import("src/app/modules/ventas/ventas.module").then(
        (m) => m.VentasModule
      ),
  },
  {
    path: "articulos",
    loadChildren: () =>
      import("src/app/modules/articulos/articulos.module").then(
        (m) => m.ArticulosModule
      ),
  },
  {
    path: "compras",
    loadChildren: () =>
      import("src/app/modules/compras/compras.module").then(
        (m) => m.ComprasModule
      ),
  },
  {
    path: "clientes",
    loadChildren: () =>
      import("src/app/modules/clientes/clientes.module").then(
        (m) => m.ClientesModule
      ),
  },
  {
    path: "almacen",
    loadChildren: () =>
      import("src/app/modules/almacen/almacen.module").then(
        (m) => m.AlmacenModule
      ),
  },
  {
    path: "caja",
    loadChildren: () =>
      import("src/app/modules/caja/caja.module").then(
        (m) => m.CajaModule
      ),
  },
  {
    path: "gestion",
    component: GestionComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion/empleados",
    component: GestionEmpleadosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion/tipos-pago",
    component: GestionTiposPagoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion/backup",
    component: BackupComponent,
    canActivate: [isOpenedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
