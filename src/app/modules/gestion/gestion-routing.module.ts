import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { BackupComponent } from "src/app/modules/gestion/pages/backup/backup.component";
import { GestionEmpleadosComponent } from "src/app/modules/gestion/pages/gestion-empleados/gestion-empleados.component";
import { GestionTiposPagoComponent } from "src/app/modules/gestion/pages/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/modules/gestion/pages/gestion/gestion.component";
import { InstallationComponent } from "src/app/modules/gestion/pages/installation/installation.component";

const routes: Routes = [
  { path: "installation", component: InstallationComponent },
  {
    path: "",
    component: GestionComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "empleados",
    component: GestionEmpleadosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "tipos-pago",
    component: GestionTiposPagoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "backup",
    component: BackupComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionRoutingModule {}
