import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent }         from './pages/main/main.component';
import { InstallationComponent } from './pages/installation/installation.component';
import { VentasComponent }       from './pages/ventas/ventas.component';
import { ArticulosComponent }    from './pages/articulos/articulos.component';
import { PedidosComponent }      from './pages/pedidos/pedidos.component';
import { ClientesComponent }     from './pages/clientes/clientes.component';
import { AlmacenComponent }      from './pages/almacen/almacen.component';
import { GestionComponent }      from './pages/gestion/gestion.component';

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
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
