import { Route } from '@angular/router';
import isOpenedGuardFn from '@guard/opened.guard.fn';

const GESTION_ROUTES: Route[] = [
  {
    path: 'installation',
    loadComponent: () => import('@modules/configuracion/pages/installation/installation.component'),
  },
  {
    path: '',
    loadComponent: () => import('@modules/configuracion/pages/configuracion/configuracion.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'empleados',
    loadComponent: () =>
      import('@modules/configuracion/pages/configuracion-empleados/configuracion-empleados.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'tipos-pago',
    loadComponent: () =>
      import('@modules/configuracion/pages/configuracion-tipos-pago/configuracion-tipos-pago.component'),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: 'backup',
    loadComponent: () => import('@modules/configuracion/pages/backup/backup.component'),
    canActivate: [isOpenedGuardFn],
  },
];

export default GESTION_ROUTES;
