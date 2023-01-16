import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { ArticulosComponent } from "src/app/pages/articulos/articulos.component";
import { ClientesComponent } from "src/app/pages/clientes/clientes.component";
import { ComprasComponent } from "src/app/pages/compras/compras/compras.component";
import { PedidoComponent } from "src/app/pages/compras/pedido/pedido.component";
import { FacturaComponent } from "src/app/pages/factura/factura.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionMarcasComponent } from "src/app/pages/gestion/gestion-marcas/gestion-marcas.component";
import { GestionProveedoresComponent } from "src/app/pages/gestion/gestion-proveedores/gestion-proveedores.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { InventarioPrintComponent } from "src/app/pages/inventario-print/inventario-print.component";
import { LopdComponent } from "src/app/pages/lopd/lopd.component";
import { MainComponent } from "src/app/pages/main/main.component";
import { VentasComponent } from "src/app/pages/ventas/ventas.component";
import { CajaComponent } from "src/app/pages/caja/caja.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "installation", component: InstallationComponent },
  { path: "ventas", component: VentasComponent },
  { path: "ventas/:id", component: VentasComponent },
  { path: "articulos", component: ArticulosComponent },
  { path: "articulos/:localizador", component: ArticulosComponent },
  {
    path: "articulos/:localizador/return/:where",
    component: ArticulosComponent,
  },
  {
    path: "articulos/:localizador/return/:where/:id",
    component: ArticulosComponent,
  },
  { path: "compras", component: ComprasComponent },
  { path: "compras/pedido", component: PedidoComponent },
  { path: "compras/pedido/:id", component: PedidoComponent },
  { path: "clientes", component: ClientesComponent },
  { path: "clientes/:new", component: ClientesComponent },
  { path: "lopd/:id", component: LopdComponent },
  { path: "almacen", component: AlmacenComponent },
  { path: "caja", component: CajaComponent },
  { path: "gestion", component: GestionComponent },
  { path: "gestion/empleados", component: GestionEmpleadosComponent },
  { path: "gestion/marcas", component: GestionMarcasComponent },
  { path: "gestion/proveedores", component: GestionProveedoresComponent },
  { path: "gestion/tipos-pago", component: GestionTiposPagoComponent },
  {
    path: "factura/:id",
    component: FacturaComponent,
    data: { type: "print" },
  },
  {
    path: "factura/:id/preview",
    component: FacturaComponent,
    data: { type: "preview" },
  },
  { path: "inventario-print/:data", component: InventarioPrintComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
