import { Route, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/modules/main/main-routes").then(
        (m): Route[] => m.MAIN_ROUTES
      ),
  },
  {
    path: "ventas",
    loadChildren: () =>
      import("src/app/modules/ventas/ventas-routes").then(
        (m): Route[] => m.VENTAS_ROUTES
      ),
  },
  {
    path: "articulos",
    loadChildren: () =>
      import("src/app/modules/articulos/articulos-routes").then(
        (m): Route[] => m.ARTICULOS_ROUTES
      ),
  },
  {
    path: "compras",
    loadChildren: () =>
      import("src/app/modules/compras/compras-routes").then(
        (m): Route[] => m.COMPRAS_ROUTES
      ),
  },
  {
    path: "clientes",
    loadChildren: () =>
      import("src/app/modules/clientes/clientes-routes").then(
        (m): Route[] => m.CLIENTES_ROUTES
      ),
  },
  {
    path: "almacen",
    loadChildren: () =>
      import("src/app/modules/almacen/almacen-routes").then(
        (m): Route[] => m.ALMACEN_ROUTES
      ),
  },
  {
    path: "caja",
    loadChildren: () =>
      import("src/app/modules/caja/caja-routes").then(
        (m): Route[] => m.CAJA_ROUTES
      ),
  },
  {
    path: "gestion",
    loadChildren: () =>
      import("src/app/modules/gestion/gestion-routes").then(
        (m): Route[] => m.GESTION_ROUTES
      ),
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
