import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./dashboard').then((m) => m.Dashboard), data: { title: 'داشبورد' } },
  { path: 'orders', loadComponent: () => import('./orders').then((m) => m.Orders), data: { title: 'سفارش‌ها' } },
  { path: 'favorites', loadComponent: () => import('./favorites').then((m) => m.Favorites), data: { title: 'علاقه‌مندی‌ها' } },
  { path: 'addresses', loadComponent: () => import('./addresses').then((m) => m.Addresses), data: { title: 'آدرس‌ها' } },
  { path: 'profile', loadComponent: () => import('./profile').then((m) => m.Profile), data: { title: 'اطلاعات حساب' } },
  { path: 'settings', loadComponent: () => import('./settings').then((m) => m.Settings), data: { title: 'تنظیمات ظاهری' } },
];
