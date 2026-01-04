import { Route } from '@angular/router';
import isOpenedGuardFn from '@guard/opened.guard.fn';

const GESTION_ROUTES: Route[] = [
  {
    path: 'installation',
    loadComponent: () => import('@modules/gestion/pages/installation/installation.component'),
  },
  {
    path: '',
    loadComponent: () => import('@modules/gestion/pages/gestion/gestion.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'empleados',
    loadComponent: () =>
      import('@modules/gestion/pages/gestion-empleados/gestion-empleados.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'tipos-pago',
    loadComponent: () =>
      import('@modules/gestion/pages/gestion-tipos-pago/gestion-tipos-pago.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'backup',
    loadComponent: () => import('@modules/gestion/pages/backup/backup.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default GESTION_ROUTES;
