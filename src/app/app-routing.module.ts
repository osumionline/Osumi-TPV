import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent }         from 'src/app/pages/main/main.component';
import { InstallationComponent } from 'src/app/pages/installation/installation.component';
import { VentasComponent }       from 'src/app/pages/ventas/ventas.component';
import { ArticulosComponent }    from 'src/app/pages/articulos/articulos.component';
import { PedidosComponent }      from 'src/app/pages/pedidos/pedidos.component';
import { ClientesComponent }     from 'src/app/pages/clientes/clientes.component';
import { AlmacenComponent }      from 'src/app/pages/almacen/almacen.component';
import { GestionComponent }      from 'src/app/pages/gestion/gestion.component';
import { FacturaComponent }      from 'src/app/pages/factura/factura.component';

const routes: Routes = [
	{ path: '',                       component: MainComponent },
	{ path: 'installation',           component: InstallationComponent },
	{ path: 'ventas',                 component: VentasComponent },
	{ path: 'articulos',              component: ArticulosComponent },
	{ path: 'articulos/:localizador', component: ArticulosComponent },
	{ path: 'pedidos',                component: PedidosComponent },
	{ path: 'clientes',               component: ClientesComponent },
	{ path: 'almacen',                component: AlmacenComponent },
	{ path: 'gestion',                component: GestionComponent },
	{ path: 'factura/:id',            component: FacturaComponent },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
