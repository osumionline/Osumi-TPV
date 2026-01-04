import { Route } from '@angular/router';
import isOpenedGuardFn from '@guard/opened.guard.fn';

const VENTAS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@modules/ventas/pages/ventas/ventas.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ':id',
    loadComponent: () => import('@modules/ventas/pages/ventas/ventas.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default VENTAS_ROUTES;
