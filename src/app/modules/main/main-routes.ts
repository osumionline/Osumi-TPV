import { Route } from "@angular/router";

export const MAIN_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () => import("./pages/main/main.component"),
  },
];
