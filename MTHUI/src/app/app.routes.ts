import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PageVisibilityService } from './services/page-visibility.service';

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.currentUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.currentUser()?.role?.toLowerCase() === 'admin') {
    return true;
  }
  return router.parseUrl('/');
};

const pageVisibilityGuard = (page: 'note' | 'software' | 'blog'): CanActivateFn => {
  return () => {

    const visibilityService = inject(PageVisibilityService);
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    if (authService.isAdmin()) {
      return true; // Admins can always access pages
    }

    if (visibilityService.isPageVisible(page)) {
      return true;
    }
    return router.parseUrl('/');
  };
};

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'note',
    canActivate: [pageVisibilityGuard('note')],
    loadComponent: () => import('./pages/notes/notes.component').then(m => m.NotesComponent)
  },
  {
    path: 'note/:id',
    canActivate: [pageVisibilityGuard('note')],
    loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'software',
    canActivate: [pageVisibilityGuard('software')],
    loadComponent: () => import('./pages/software/software.component').then(m => m.SoftwareComponent)
  },
  {
    path: 'software/:id',
    canActivate: [pageVisibilityGuard('software')],
    loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'blog',
    canActivate: [pageVisibilityGuard('blog')],
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
  },
  {
    path: 'blog/:id',
    canActivate: [pageVisibilityGuard('blog')],
    loadComponent: () => import('./pages/blog/blog-post/blog-post.component').then(m => m.BlogPostComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent)
  },
  {
    path: 'admin/notes',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-notes/manage-notes.component').then(m => m.ManageNotesComponent)
  },
  {
    path: 'admin/software',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-software/manage-software.component').then(m => m.ManageSoftwareComponent)
  },
  {
    path: 'admin/blogs',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-blogs/manage-blogs.component').then(m => m.ManageBlogsComponent)
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent)
  },
  {
    path: 'admin/reviews',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-reviews/manage-reviews.component').then(m => m.ManageReviewsComponent)
  },
  {
    path: 'admin/settings',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/manage-visibility/manage-visibility.component').then(m => m.ManageVisibilityComponent)
  },
  { path: '**', redirectTo: '' }
];
