import { Component, OnInit } from '@angular/core';
import { Note } from '../../core/models/note';
import { NoteService } from '../../core/services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-notes',
  templateUrl: './admin-notes.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminNotesComponent implements OnInit {

  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  selectedNote: Note | null = null;
  mode: 'view' | 'edit' | 'create' | 'delete' | null = null;

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getAll().subscribe({
      next: notes => this.notesSubject.next(notes.filter(n => !n.isDeleted)),
      error: err => console.error('Error loading notes:', err)
    });
  }

  viewNote(note: Note) {
    this.mode = 'view';
    this.selectedNote = note;
  }

  createNewNote() {
    this.mode = 'create';
    this.selectedNote = {
      title: '',
      content: '',
      description: '',
      author: '',
      price: 0
    } as Note;
  }

  editNote(note: Note) {
    this.mode = 'edit';
    this.selectedNote = { ...note };
  }

  confirmDelete(note: Note) {
    this.mode = 'delete';
    this.selectedNote = note;
  }

  saveNote() {
    if (!this.selectedNote) return;

    // Validation: Title and Content required
    if (!this.selectedNote.title?.trim() || !this.selectedNote.content?.trim()) {
      alert('Title and Content are required');
      return;
    }

    if (this.mode === 'create') {
      // Remove id and createdAt before sending
      const { id, createdAt, ...noteData } = this.selectedNote;

      this.noteService.create(noteData as Note).subscribe({
        next: () => {
          this.loadNotes();
          this.close();
        },
        error: err => console.error('Error creating note:', err)
      });
    } else if (this.mode === 'edit') {
      this.noteService.update(this.selectedNote.id!, this.selectedNote).subscribe({
        next: () => {
          this.loadNotes();
          this.close();
        },
        error: err => console.error('Error updating note:', err)
      });
    }
  }

  deleteNote() {
    if (!this.selectedNote) return;

    this.noteService.delete(this.selectedNote.id!).subscribe({
      next: () => {
        this.loadNotes(); // Refresh table
        this.close();     // Close confirmation page
      },
      error: err => console.error('Error deleting note:', err)
    });
  }

  close() {
    this.selectedNote = null;
    this.mode = null;
  }
}
