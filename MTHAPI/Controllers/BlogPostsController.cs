using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/blogposts")]
public class BlogPostsController : ControllerBase
{
    private readonly IBlogPostService _blogPostService;

    public BlogPostsController(IBlogPostService blogPostService)
    {
        _blogPostService = blogPostService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BlogPostDto>), 200)]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetBlogPosts()
    {
        var posts = await _blogPostService.GetBlogPostsAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BlogPostDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<BlogPostDto>> GetBlogPost(string id)
    {
        var post = await _blogPostService.GetBlogPostByIdAsync(id);
        if (post == null)
        {
            return NotFound();
        }
        return Ok(post);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BlogPostDto), 201)]
    public async Task<ActionResult<BlogPostDto>> CreateBlogPost([FromBody] BlogPostCreateUpdateDto postDto)
    {
        var newPost = await _blogPostService.CreateBlogPostAsync(postDto);
        return CreatedAtAction(nameof(GetBlogPost), new { id = newPost.Id }, newPost);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BlogPostDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<BlogPostDto>> UpdateBlogPost(string id, [FromBody] BlogPostCreateUpdateDto postDto)
    {
        var (post, error) = await _blogPostService.UpdateBlogPostAsync(id, postDto);
        if (error != null)
        {
            return NotFound(new { message = error });
        }
        return Ok(post);
    }

    [HttpPatch("{id}/delete")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> SoftDeleteBlogPost(string id)
    {
        var (success, error) = await _blogPostService.SoftDeleteBlogPostAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpPatch("{id}/restore")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> RestoreBlogPost(string id)
    {
        var (success, error) = await _blogPostService.RestoreBlogPostAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpPatch("{id}/toggle-featured")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ToggleFeatured(string id)
    {
        var (success, error) = await _blogPostService.ToggleFeaturedStatusAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteBlogPostPermanently(string id)
    {
        var (success, error) = await _blogPostService.DeleteBlogPostPermanentlyAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }
}
