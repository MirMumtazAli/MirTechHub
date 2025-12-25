using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReviewController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/review
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reviews = await _unitOfWork.Reviews.GetAllAsync();
            return Ok(reviews);
        }

        // GET: api/review/software/5
        [HttpGet("software/{softwareId}")]
        public async Task<IActionResult> GetBySoftware(int softwareId)
        {
            var reviews = await _unitOfWork.Reviews.GetBySoftwareIdAsync(softwareId);
            return Ok(reviews);
        }

        // GET: api/review/note/5
        [HttpGet("note/{noteId}")]
        public async Task<IActionResult> GetByNote(int noteId)
        {
            var reviews = await _unitOfWork.Reviews.GetByNoteIdAsync(noteId);
            return Ok(reviews);
        }

        // POST: api/review
        [HttpPost]
        public async Task<IActionResult> Create(Review review)
        {
            review.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Reviews.AddAsync(review);
            await _unitOfWork.CompleteAsync();

            return Ok(review);
        }

        // PUT: api/review/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Review updated)
        {
            var review = await _unitOfWork.Reviews.GetByIdAsync(id);
            if (review == null) return NotFound();

            review.Rating = updated.Rating;
            review.Comment = updated.Comment;

            _unitOfWork.Reviews.Update(review);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // SOFT DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _unitOfWork.Reviews.GetByIdAsync(id);
            if (review == null) return NotFound();

            _unitOfWork.Reviews.SoftDelete(review);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}