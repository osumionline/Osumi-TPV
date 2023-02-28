import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const ARTICULOS_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () => import("./pages/articulos/articulos.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":localizador",
    loadComponent: () => import("./pages/articulos/articulos.component"),
    canActivate: [isOpenedGuardFn],
  },
];
