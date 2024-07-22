import { Route, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@modules/main/main-routes').then((m): Route[] => m.default),
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import('@modules/ventas/ventas-routes').then((m): Route[] => m.default),
  },
  {
    path: 'articulos',
    loadChildren: () =>
      import('@modules/articulos/articulos-routes').then(
        (m): Route[] => m.default
      ),
  },
  {
    path: 'compras',
    loadChildren: () =>
      import('@modules/compras/compras-routes').then((m): Route[] => m.default),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('@modules/clientes/clientes-routes').then(
        (m): Route[] => m.default
      ),
  },
  {
    path: 'almacen',
    loadChildren: () =>
      import('@modules/almacen/almacen-routes').then((m): Route[] => m.default),
  },
  {
    path: 'caja',
    loadChildren: () =>
      import('@modules/caja/caja-routes').then((m): Route[] => m.default),
  },
  {
    path: 'gestion',
    loadChildren: () =>
      import('@modules/gestion/gestion-routes').then((m): Route[] => m.default),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

export default routes;
