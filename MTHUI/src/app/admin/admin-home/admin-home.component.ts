import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
  templateUrl: './admin-home.component.html',
})
export class AdminHomeComponent {
  // Add any properties or methods for dashboard stats here

}
