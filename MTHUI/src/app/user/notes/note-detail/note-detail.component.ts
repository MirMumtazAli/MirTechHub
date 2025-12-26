import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../../../core/models/note';
import { NoteService } from '../../../core/services/note.service';


@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-detail.component.html'
})
export class NoteDetailComponent implements OnInit {

  note!: Note;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.noteService.getById(id).subscribe({
      next: res => {
        this.note = res;
        this.loading = false;
      },
      error: () => {
        // Note not found OR deleted
        this.loading = false;
        this.router.navigate(['/notes']);
      }
    });
  }

  buyNow() {
    // Next step → Cart / OrderItem
    console.log('Buying note:', this.note.id);
  }
}
