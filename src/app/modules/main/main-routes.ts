import { Route } from "@angular/router";

export const MAIN_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () => import("@modules/main/pages/main/main.component"),
  },
];
