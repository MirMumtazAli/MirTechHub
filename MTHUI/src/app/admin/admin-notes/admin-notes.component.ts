import { Component, OnInit } from '@angular/core';
import { Note, NoteForm } from '../../core/models/note';
import { NoteService } from '../../core/services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

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

  constructor(private noteService: NoteService) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  /** Load all notes (excluding deleted) */
  loadNotes() {
    this.noteService.getAll().subscribe({
      next: notes => this.notesSubject.next(notes),
      error: err => console.error(err)
    });
  }

  /** View a note */
  viewNote(note: Note) {
    this.mode = 'view';
    this.selectedNote = { ...note };
  }

  /** Prepare to create a new note */
  createNewNote() {
    this.mode = 'create';
    this.selectedNote = {
      title: '',
      content: '',
      description: '',
      price: 0,
      isFree: false,
      fileUrl: '',
      pages: 0,
      createdAt: new Date(),
      isDeleted: false
    } as Note;
  }

  /** Edit an existing note */
  editNote(note: Note) {
    this.mode = 'edit';
    this.selectedNote = { ...note };
  }

  /** Confirm deletion */
  confirmDelete(note: Note) {
    this.mode = 'delete';
    this.selectedNote = { ...note };
  }

  /** Save note (create or update) */
  saveNote() {
    if (!this.selectedNote) return;

    // Basic validation
    if (!this.selectedNote.title?.trim() || !this.selectedNote.content?.trim()) {
      alert('Title and Content are required');
      return;
    }

    // Prepare payload compatible with NoteForm DTO
    const payload: NoteForm = {
      title: this.selectedNote.title,
      description: this.selectedNote.description,
      content: this.selectedNote.content,
      price: this.selectedNote.price,
      isFree: this.selectedNote.isFree,
      fileUrl: this.selectedNote.fileUrl,
      pages: this.selectedNote.pages
    };

    if (this.mode === 'create') {
      this.noteService.create(payload).subscribe({
        next: () => {
          this.loadNotes();
          this.close();
        },
        error: err => console.error('Error creating note:', err)
      });
    } else if (this.mode === 'edit') {
      this.noteService.update(this.selectedNote.id!, payload).subscribe({
        next: () => {
          this.loadNotes();
          this.close();
        },
        error: err => console.error('Error updating note:', err)
      });
    }
  }

  /** Delete a note (soft delete) */
  deleteNote() {
    if (!this.selectedNote) return;

    this.noteService.delete(this.selectedNote.id!).subscribe({
      next: () => {
        this.loadNotes();
        this.close();
      },
      error: err => console.error('Error deleting note:', err)
    });
  }

  restoreNote(note: Note) {
    this.noteService.restore(note.id).subscribe({
      next: () => this.loadNotes(),
      error: err => console.error('Error restoring note', err)
    });
  }

  /** Close form/modal */
  close() {
    this.selectedNote = null;
    this.mode = null;
  }
}
