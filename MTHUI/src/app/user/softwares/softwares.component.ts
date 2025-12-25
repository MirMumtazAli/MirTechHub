import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SoftwareService } from '../../core/services/software.service';
import { Software } from '../../core/models/software';

@Component({
  selector: 'app-softwares',
  templateUrl: './softwares.component.html',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
})
export class SoftwaresComponent implements OnInit {
  softwares: Software[] = [];

  constructor(private softwareService: SoftwareService, private router: Router) { }

  ngOnInit(): void {
    this.softwareService.getAll().subscribe(data => this.softwares = data);
  }

  viewDetails(id: number) {
    this.router.navigate(['/software-detail', id]);
  }
}
