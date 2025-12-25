import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-blog',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
  templateUrl: './manage-blog.component.html',
})
export class ManageBlogComponent {

}
