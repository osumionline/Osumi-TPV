import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { ArticulosComponent } from "src/app/pages/articulos/articulos.component";
import { ClientesComponent } from "src/app/pages/clientes/clientes.component";
import { FacturaComponent } from "src/app/pages/factura/factura.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionMarcasComponent } from "src/app/pages/gestion/gestion-marcas/gestion-marcas.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { MainComponent } from "src/app/pages/main/main.component";
import { PedidosComponent } from "src/app/pages/pedidos/pedidos.component";
import { VentasComponent } from "src/app/pages/ventas/ventas.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "installation", component: InstallationComponent },
  { path: "ventas", component: VentasComponent },
  { path: "articulos", component: ArticulosComponent },
  { path: "articulos/:localizador", component: ArticulosComponent },
  { path: "pedidos", component: PedidosComponent },
  { path: "clientes", component: ClientesComponent },
  { path: "almacen", component: AlmacenComponent },
  { path: "gestion", component: GestionComponent },
  { path: "gestion/empleados", component: GestionEmpleadosComponent },
  { path: "gestion/marcas", component: GestionMarcasComponent },
  { path: "factura/:id", component: FacturaComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
