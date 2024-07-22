import { Route } from '@angular/router';
import isOpenedGuardFn from '@app/guard/opened.guard.fn';

const COMPRAS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@modules/compras/pages/compras/compras.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'pedido',
    loadComponent: () =>
      import('@modules/compras/pages/pedido/pedido.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'pedido/:id',
    loadComponent: () =>
      import('@modules/compras/pages/pedido/pedido.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default COMPRAS_ROUTES;
