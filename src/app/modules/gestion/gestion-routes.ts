import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const GESTION_ROUTES: Route[] = [
  {
    path: "installation",
    loadComponent: () => import("./pages/installation/installation.component"),
  },
  {
    path: "",
    loadComponent: () => import("./pages/gestion/gestion.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "empleados",
    loadComponent: () =>
      import("./pages/gestion-empleados/gestion-empleados.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "tipos-pago",
    loadComponent: () =>
      import("./pages/gestion-tipos-pago/gestion-tipos-pago.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "backup",
    loadComponent: () => import("./pages/backup/backup.component"),
    canActivate: [isOpenedGuardFn],
  },
];
