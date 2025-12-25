using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
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

        public IEnumerable<Note> GetAll()
        {
            return _context.Notes
                .Where(n => !n.IsDeleted)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
        }

        public Note GetById(int id)
        {
            return _context.Notes.FirstOrDefault(n => n.Id == id && !n.IsDeleted);
        }

        public void Add(Note note)
        {
            _context.Notes.Add(note);
        }

        public void Update(Note note)
        {
            _context.Notes.Update(note);
        }

        public void SoftDelete(Note note)
        {
            note.IsDeleted = true;
            _context.Notes.Update(note);
        }
    }
}
