import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Note } from '../../../core/models/note';
import { NoteService } from '../../../core/services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NoteDetailComponent implements OnInit {
  note: Note | null = null;

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.noteService.getById(id).subscribe(data => this.note = data);
  }
}
