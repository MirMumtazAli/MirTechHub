using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), 200)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAllReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();
        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), 201)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] ReviewCreateDto reviewDto)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(authorId))
        {
            return Unauthorized();
        }

        var (review, error) = await _reviewService.CreateReviewAsync(reviewDto, authorId);

        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        return CreatedAtAction(nameof(GetAllReviews), new { id = review!.Id }, review);
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(object), 404)]
    [ProducesResponseType(typeof(object), 403)]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewUpdateDto reviewDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var (success, error) = await _reviewService.UpdateReviewAsync(id, reviewDto, userId, isAdmin);

        if (!success)
        {
            return error == "Forbidden" ? Forbid() : NotFound(new { message = error });
        }

        return NoContent();
    }

    [HttpPut("{id}/visibility")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(object), 404)]
    public async Task<IActionResult> UpdateReviewVisibility(int id, [FromBody] ReviewVisibilityUpdateDto visibilityDto)
    {
        var (success, error) = await _reviewService.UpdateReviewVisibilityAsync(id, visibilityDto.IsVisible);

        if (!success)
        {
            return NotFound(new { message = error });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(object), 404)]
    [ProducesResponseType(typeof(object), 403)]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var (success, error) = await _reviewService.DeleteReviewAsync(id, userId, isAdmin);

        if (!success)
        {
            return error == "Forbidden" ? Forbid() : NotFound(new { message = error });
        }

        return NoContent();
    }
}
