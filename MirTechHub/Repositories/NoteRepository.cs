using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly MTHDbContext _context;

        public NoteRepository(MTHDbContext context)
        {
            _context = context;
        }

        // ADMIN: get ALL notes (active + deleted)
        public IEnumerable<Note> GetAll()
        {
            return _context.Notes
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
        }

        // Allow fetching deleted notes (needed for Undo)
        public Note GetById(int id)
        {
            return _context.Notes.FirstOrDefault(n => n.Id == id);
        }

        public void Add(Note note)
        {
            _context.Notes.Add(note);
        }

        public void Update(Note note)
        {
            _context.Notes.Update(note);
        }

        // Soft delete remains same
        public void SoftDelete(Note note)
        {
            note.IsDeleted = true;
            _context.Notes.Update(note);
        }

        // OPTIONAL (recommended): Restore / Undo
        public void Restore(Note note)
        {
            note.IsDeleted = false;
            _context.Notes.Update(note);
        }
    }
}
