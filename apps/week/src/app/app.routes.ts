import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { authGuard } from '@single-push/auth';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@single-push/login').then((m) => m!.LoginComponent),
  },
  {
    path: 'sunday',
    canActivate: [authGuard],
    loadChildren: () => import('sunday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'monday',
    canActivate: [authGuard],
    loadChildren: () => import('monday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'tuesday',
    canActivate: [authGuard],
    loadChildren: () => import('tuesday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'wednesday',
    canActivate: [authGuard],
    loadChildren: () => import('wednesday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'thursday',
    canActivate: [authGuard],
    loadChildren: () => import('thursday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'friday',
    canActivate: [authGuard],
    loadChildren: () => import('friday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'saturday',
    canActivate: [authGuard],
    loadChildren: () => import('saturday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: NxWelcomeComponent,
  },
];
