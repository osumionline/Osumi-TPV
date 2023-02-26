import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/modules/main/main.module").then((m) => m.MainModule),
  },
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
      import("src/app/modules/caja/caja.module").then((m) => m.CajaModule),
  },
  {
    path: "gestion",
    loadChildren: () =>
      import("src/app/modules/gestion/gestion.module").then(
        (m) => m.GestionModule
      ),
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
