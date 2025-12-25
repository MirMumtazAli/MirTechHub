import { Component, OnInit } from '@angular/core';
import { Software } from '../../core/models/software';
import { SoftwareService } from '../../core/services/software.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-softwares',
  templateUrl: './admin-softwares.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule] // needed for routerLink in template
})
export class AdminSoftwaresComponent implements OnInit {
  softwares: Software[] = [];
  selectedSoftware: Software | null = null;

  constructor(private softwareService: SoftwareService) { }

  ngOnInit(): void {
    this.loadSoftwares();
  }

  loadSoftwares() {
    this.softwareService.getAll().subscribe(data => {
      this.softwares = data;
    });
  }

  selectSoftware(software: Software) {
    this.selectedSoftware = { ...software }; // copy for edit
  }

  createSoftware(software: Software) {
    this.softwareService.create(software).subscribe(() => this.loadSoftwares());
  }

  updateSoftware(software: Software) {
    if (!software.id) return;
    this.softwareService.update(software.id, software).subscribe(() => this.loadSoftwares());
  }

  deleteSoftware(id: number) {
    this.softwareService.delete(id).subscribe(() => this.loadSoftwares());
  }
}
