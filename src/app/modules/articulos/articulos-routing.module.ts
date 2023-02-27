import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/articulos/articulos.component").then(
        (m) => m.ArticulosComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":localizador",
    loadComponent: () =>
      import("./pages/articulos/articulos.component").then(
        (m) => m.ArticulosComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosRoutingModule {}
