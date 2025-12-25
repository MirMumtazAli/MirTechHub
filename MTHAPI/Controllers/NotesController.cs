using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/notes
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_unitOfWork.Notes.GetAll());
        }

        // GET: api/notes/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();
            return Ok(note);
        }

        // POST: api/notes
        [HttpPost]
        public IActionResult Create(Note note)
        {
            note.CreatedAt = DateTime.UtcNow;
            _unitOfWork.Notes.Add(note);
            _unitOfWork.CompleteAsync();

            return Ok(note);
        }

        // PUT: api/notes/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, Note updatedNote)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();

            note.Title = updatedNote.Title;
            note.Content = updatedNote.Content;
            note.Description = updatedNote.Description;
            note.Price = updatedNote.Price;

            _unitOfWork.CompleteAsync();
            return NoContent();
        }

        // DELETE: api/notes/{id}  (SOFT DELETE)
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();

            _unitOfWork.Notes.SoftDelete(note);
            _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}