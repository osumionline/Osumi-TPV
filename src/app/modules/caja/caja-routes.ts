import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const CAJA_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/caja/caja.component").then((m) => m.CajaComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/detallado/:year/:month",
    loadComponent: () =>
      import("./pages/informe-detallado/informe-detallado.component").then(
        (m) => m.InformeDetalladoComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/simple/:year/:month",
    loadComponent: () =>
      import("./pages/informe-simple/informe-simple.component").then(
        (m) => m.InformeSimpleComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
];
