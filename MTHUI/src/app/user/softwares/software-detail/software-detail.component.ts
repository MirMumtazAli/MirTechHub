import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Software } from '../../../core/models/software';
import { SoftwareService } from '../../../core/services/software.service';


@Component({
  selector: 'app-software-detail',
  templateUrl: './software-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SoftwareDetailComponent implements OnInit {
  software: Software | null = null;

  constructor(private route: ActivatedRoute, private softwareService: SoftwareService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.softwareService.getById(id).subscribe(data => this.software = data);
  }
}
