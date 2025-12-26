import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteService } from '../../core/services/note.service';
import { Note } from '../../core/models/note';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];
  loading = true;

  constructor(
    private noteService: NoteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.noteService.getActive().subscribe({
      next: res => {
        // Extra safety in case backend changes
        this.notes = res.filter(n => !n.isDeleted);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  viewNote(id: number): void {
    this.router.navigate(['/notes', id]);
  }
}
