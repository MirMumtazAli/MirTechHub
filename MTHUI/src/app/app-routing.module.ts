import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes'; // <-- import your routes

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


//import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';

//// Common
//import { HomeComponent } from './common/home/home.component';
//import { CartComponent } from './common/cart/cart.component';
//import { BlogListComponent } from './common/blog/blog-list/blog-list.component';
//import { BlogDetailComponent } from './common/blog/blog-detail/blog-detail.component';

//// User
//import { NotesComponent } from './user/notes/notes.component';
//import { NoteDetailComponent } from './user/notes/note-detail/note-detail.component';
//import { SoftwaresComponent } from './user/softwares/softwares.component';
//import { SoftwareDetailComponent } from './user/softwares/software-detail/software-detail.component';
//import { OrdersComponent } from './user/orders/orders.component';
//import { PostReviewComponent } from './user/post-review/post-review.component';

//// Admin
//import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
//import { AdminNotesComponent } from './admin/admin-notes/admin-notes.component';
//import { AdminSoftwaresComponent } from './admin/admin-softwares/admin-softwares.component';
//import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
//import { AdminReviewsComponent } from './admin/admin-reviews/admin-reviews.component';
//import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
//import { ManageBlogComponent } from './admin/blog/manage-blog/manage-blog.component';
//import { AddBlogComponent } from './admin/blog/add-blog/add-blog.component';
//import { AdminBlogListComponent } from './admin/blog/blog-list/blog-list.component';

//const routes: Routes = [
//  { path: '', component: HomeComponent },
//  { path: 'cart', component: CartComponent },

//  // Blog
//  { path: 'blog', component: BlogListComponent },
//  { path: 'blog/:id', component: BlogDetailComponent },

//  // User
//  { path: 'notes', component: NotesComponent },
//  { path: 'notes/:id', component: NoteDetailComponent },
//  { path: 'softwares', component: SoftwaresComponent },
//  { path: 'softwares/:id', component: SoftwareDetailComponent },
//  { path: 'orders', component: OrdersComponent },
//  { path: 'post-review/:id', component: PostReviewComponent },

//  // Admin
//  { path: 'admin', component: AdminHomeComponent },
//  { path: 'admin/login', component: AdminLoginComponent },
//  { path: 'admin/notes', component: AdminNotesComponent },
//  { path: 'admin/softwares', component: AdminSoftwaresComponent },
//  { path: 'admin/orders', component: AdminOrdersComponent },
//  { path: 'admin/reviews', component: AdminReviewsComponent },
//  // Admin Blog Routes
//  {path: 'admin/blog/manage-blog', component: ManageBlogComponent},
//  {path: 'admin/blog/add-blog', component: AddBlogComponent},
//  {path: 'admin/blog/blog-list', component: AdminBlogListComponent}
//];

//@NgModule({
//  imports: [RouterModule.forRoot(routes)],
//  exports: [RouterModule]
//})
//export class AppRoutingModule { }
