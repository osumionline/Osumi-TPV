import { Route } from '@angular/router';
import isOpenedGuardFn from '@guard/opened.guard.fn';

const ARTICULOS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@modules/articulos/pages/articulos/articulos.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'categorias',
    loadComponent: () => import('@modules/articulos/pages/categorias/categorias.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default ARTICULOS_ROUTES;
