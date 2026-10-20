import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  { path: 'shop/:category', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  {
    path: 'product/:slug',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage),
  },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account-layout').then((m) => m.AccountLayout),
    loadChildren: () => import('./pages/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
