import { Route } from '@angular/router';

const MAIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@modules/main/pages/main/main.component'),
  },
];

export default MAIN_ROUTES;
