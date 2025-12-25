import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Note } from '../../core/models/note';
import { NoteService } from '../../core/services/note.service';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.noteService.getAll().subscribe(data => this.notes = data);
  }

  viewDetails(id: number) {
    this.router.navigate(['/note-detail', id]);
  }
}
