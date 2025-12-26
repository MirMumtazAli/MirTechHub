using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using MTHAPI.DTO.Note;

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

        [HttpGet("active")]
        public IActionResult GetActiveNotes()
        {
            var notes = _unitOfWork.Notes
                .GetAll()
                .Where(n => !n.IsDeleted)
                .ToList();

            return Ok(notes);
        }

        // GET: api/notes/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null || note.IsDeleted) 
                return NotFound();

            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NoteCreateDTO noteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var note = new Note
            {
                Title = noteDto.Title,
                Description = noteDto.Description,
                Content = noteDto.Content,
                Price = noteDto.Price,
                IsFree = noteDto.IsFree,
                FileUrl = noteDto.FileUrl,
                Pages = noteDto.Pages,
                CreatedAt = DateTime.UtcNow
            };

            _unitOfWork.Notes.Add(note);
            await _unitOfWork.CompleteAsync();

            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NoteUpdateDTO noteDto)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();

            note.Title = noteDto.Title;
            note.Description = noteDto.Description;
            note.Content = noteDto.Content;
            note.Price = noteDto.Price;
            note.IsFree = noteDto.IsFree;
            note.FileUrl = noteDto.FileUrl;
            note.Pages = noteDto.Pages;

            await _unitOfWork.CompleteAsync();
            return NoContent();
        }


        // DELETE: api/notes/{id}  (SOFT DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();

            note.IsDeleted = true;
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        [HttpPut("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            var note = _unitOfWork.Notes.GetById(id);
            if (note == null) return NotFound();

            note.IsDeleted = false;
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        

    }
}