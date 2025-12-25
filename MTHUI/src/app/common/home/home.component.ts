import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
