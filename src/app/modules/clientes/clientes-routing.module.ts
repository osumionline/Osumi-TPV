import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/clientes/clientes.component").then(
        (m) => m.ClientesComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":new",
    loadComponent: () =>
      import("./pages/clientes/clientes.component").then(
        (m) => m.ClientesComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "lopd/:id",
    loadComponent: () =>
      import("./pages/lopd/lopd.component").then((m) => m.LopdComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id",
    loadComponent: () =>
      import("./pages/factura/factura.component").then(
        (m) => m.FacturaComponent
      ),
    data: { type: "print" },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id/preview",
    loadComponent: () =>
      import("./pages/factura/factura.component").then(
        (m) => m.FacturaComponent
      ),
    data: { type: "preview" },
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule {}
