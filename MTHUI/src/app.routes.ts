import { Routes } from '@angular/router';
import { BlogDetailComponent } from './app/common/blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './app/common/blog/blog-list/blog-list.component';
import { CartComponent } from './app/common/cart/cart.component';
import { AdminHomeComponent } from './app/admin/admin-home/admin-home.component';
import { AdminLoginComponent } from './app/admin/admin-login/admin-login.component';
import { AdminNotesComponent } from './app/admin/admin-notes/admin-notes.component';
import { AdminOrdersComponent } from './app/admin/admin-orders/admin-orders.component';
import { AdminReviewsComponent } from './app/admin/admin-reviews/admin-reviews.component';
import { AdminSoftwaresComponent } from './app/admin/admin-softwares/admin-softwares.component';
import { AddBlogComponent } from './app/admin/blog/add-blog/add-blog.component';
import { AdminBlogListComponent } from './app/admin/blog/blog-list/blog-list.component';
import { ManageBlogComponent } from './app/admin/blog/manage-blog/manage-blog.component';
import { HomeComponent } from './app/common/home/home.component';
import { NoteDetailComponent } from './app/user/notes/note-detail/note-detail.component';
import { NotesComponent } from './app/user/notes/notes.component';
import { OrdersComponent } from './app/user/orders/orders.component';
import { PostReviewComponent } from './app/user/post-review/post-review.component';
import { SoftwareDetailComponent } from './app/user/softwares/software-detail/software-detail.component';
import { SoftwaresComponent } from './app/user/softwares/softwares.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },

  // Blog
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:id', component: BlogDetailComponent },

  // User
  { path: 'notes', component: NotesComponent },
  { path: 'notes/:id', component: NoteDetailComponent },
  { path: 'softwares', component: SoftwaresComponent },
  { path: 'softwares/:id', component: SoftwareDetailComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'post-review/:id', component: PostReviewComponent },

  // Admin
  { path: 'admin', component: AdminHomeComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/notes', component: AdminNotesComponent },
  { path: 'admin/softwares', component: AdminSoftwaresComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/reviews', component: AdminReviewsComponent },
  // Admin Blog Routes
  { path: 'admin/blog/manage-blog', component: ManageBlogComponent },
  { path: 'admin/blog/add-blog', component: AddBlogComponent },
  { path: 'admin/blog/blog-list', component: AdminBlogListComponent }
];
