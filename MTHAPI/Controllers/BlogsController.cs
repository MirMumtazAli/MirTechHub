using DAL.DAO;
using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/blog
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _unitOfWork.Blogs.GetAllAsync();
            return Ok(blogs);
        }

        // GET: api/blog/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        // GET: api/blog/slug/my-first-blog
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var blog = await _unitOfWork.Blogs.GetBySlugAsync(slug);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        // POST: api/blog
        [HttpPost]
        public async Task<IActionResult> Create(Blog blog)
        {
            blog.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Blogs.AddAsync(blog);
            await _unitOfWork.CompleteAsync();

            return Ok(blog);
        }

        // PUT: api/blog/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Blog updatedBlog)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return NotFound();

            blog.Title = updatedBlog.Title;
            blog.Slug = updatedBlog.Slug;
            blog.Content = updatedBlog.Content;
            blog.Summary = updatedBlog.Summary;
            blog.IsPublished = updatedBlog.IsPublished;

            _unitOfWork.Blogs.Update(blog);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/blog/5  (SOFT DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return NotFound();

            _unitOfWork.Blogs.SoftDelete(blog);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}