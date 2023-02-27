import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/ventas/ventas.component").then((m) => m.VentasComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./pages/ventas/ventas.component").then((m) => m.VentasComponent),
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
