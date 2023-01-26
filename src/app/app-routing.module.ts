import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { ArticulosComponent } from "src/app/pages/articulos/articulos.component";
import { CajaComponent } from "src/app/pages/caja/caja.component";
import { ClientesComponent } from "src/app/pages/clientes/clientes.component";
import { ComprasComponent } from "src/app/pages/compras/compras/compras.component";
import { PedidoComponent } from "src/app/pages/compras/pedido/pedido.component";
import { FacturaComponent } from "src/app/pages/factura/factura.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InformeDetalladoComponent } from "src/app/pages/informes/informe-detallado/informe-detallado.component";
import { InformeSimpleComponent } from "src/app/pages/informes/informe-simple/informe-simple.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { InventarioPrintComponent } from "src/app/pages/inventario-print/inventario-print.component";
import { LopdComponent } from "src/app/pages/lopd/lopd.component";
import { MainComponent } from "src/app/pages/main/main.component";
import { VentasComponent } from "src/app/pages/ventas/ventas.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "installation", component: InstallationComponent },
  {
    path: "ventas",
    component: VentasComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "ventas/:id",
    component: VentasComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "articulos",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "articulos/:localizador",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "articulos/:localizador/return/:where",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "articulos/:localizador/return/:where/:id",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "compras",
    component: ComprasComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "compras/pedido",
    component: PedidoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "compras/pedido/:id",
    component: PedidoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "clientes",
    component: ClientesComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "clientes/:new",
    component: ClientesComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "lopd/:id",
    component: LopdComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "almacen",
    component: AlmacenComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "caja",
    component: CajaComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion",
    component: GestionComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion/empleados",
    component: GestionEmpleadosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "gestion/tipos-pago",
    component: GestionTiposPagoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id",
    component: FacturaComponent,
    data: { type: "print" },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id/preview",
    component: FacturaComponent,
    data: { type: "preview" },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "inventario-print/:data",
    component: InventarioPrintComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/detallado/:year/:month",
    component: InformeDetalladoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/simple/:year/:month",
    component: InformeSimpleComponent,
    canActivate: [isOpenedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
