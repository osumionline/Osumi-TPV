import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { CajaComponent } from "src/app/pages/caja/caja.component";
import { BackupComponent } from "src/app/pages/gestion/backup/backup.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InformeDetalladoComponent } from "src/app/pages/informes/informe-detallado/informe-detallado.component";
import { InformeSimpleComponent } from "src/app/pages/informes/informe-simple/informe-simple.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { InventarioPrintComponent } from "src/app/pages/inventario-print/inventario-print.component";
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
    component: AlmacenComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "caja",
    component: CajaComponent,
    canActivate: [isOpenedGuardFn],
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
  {
    path: "inventario-print/:data",
    component: InventarioPrintComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/detallado/:year/:month",
    component: InformeDetalladoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/simple/:year/:month",
    component: InformeSimpleComponent,
    canActivate: [isOpenedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
