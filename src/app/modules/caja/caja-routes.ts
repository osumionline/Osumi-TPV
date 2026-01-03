import { Route } from '@angular/router';
import isOpenedGuardFn from '@guard/opened.guard.fn';

const CAJA_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@modules/caja/pages/caja/caja.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'informes/detallado/:year/:month',
    loadComponent: () =>
      import('@modules/caja/pages/informe-detallado/informe-detallado.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'informes/simple/:year/:month',
    loadComponent: () => import('@modules/caja/pages/informe-simple/informe-simple.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default CAJA_ROUTES;
