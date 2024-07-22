import { Route } from '@angular/router';
import isOpenedGuardFn from '@app/guard/opened.guard.fn';

const CLIENTES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@modules/clientes/pages/clientes/clientes.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ':new',
    loadComponent: () =>
      import('@modules/clientes/pages/clientes/clientes.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'lopd/:id',
    loadComponent: () => import('@modules/clientes/pages/lopd/lopd.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'factura/:id',
    loadComponent: () =>
      import('@modules/clientes/pages/factura/factura.component'),
    data: { type: 'print' },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'factura/:id/preview',
    loadComponent: () =>
      import('@modules/clientes/pages/factura/factura.component'),
    data: { type: 'preview' },
    canActivate: [isOpenedGuardFn],
  },
];

export default CLIENTES_ROUTES;
