import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const GESTION_ROUTES: Route[] = [
  {
    path: "installation",
    loadComponent: () =>
      import("./pages/installation/installation.component").then(
        (m) => m.InstallationComponent
      ),
  },
  {
    path: "",
    loadComponent: () =>
      import("./pages/gestion/gestion.component").then(
        (m) => m.GestionComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "empleados",
    loadComponent: () =>
      import("./pages/gestion-empleados/gestion-empleados.component").then(
        (m) => m.GestionEmpleadosComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "tipos-pago",
    loadComponent: () =>
      import("./pages/gestion-tipos-pago/gestion-tipos-pago.component").then(
        (m) => m.GestionTiposPagoComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "backup",
    loadComponent: () =>
      import("./pages/backup/backup.component").then((m) => m.BackupComponent),
    canActivate: [isOpenedGuardFn],
  },
];