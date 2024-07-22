import { Route } from '@angular/router';
import isOpenedGuardFn from '@app/guard/opened.guard.fn';

const ARTICULOS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@modules/articulos/pages/articulos/articulos.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ':localizador',
    loadComponent: () =>
      import('@modules/articulos/pages/articulos/articulos.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default ARTICULOS_ROUTES;
