import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajaRoutingModule {}
