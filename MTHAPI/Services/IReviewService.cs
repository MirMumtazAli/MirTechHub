using System.Collections.Generic;
using System.Threading.Tasks;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
    Task<(ReviewDto? Review, string? Error)> CreateReviewAsync(ReviewCreateDto reviewDto, string authorId);
    Task<(bool Success, string? Error)> UpdateReviewAsync(int reviewId, ReviewUpdateDto reviewDto, string userId, bool isAdmin);
    Task<(bool Success, string? Error)> UpdateReviewVisibilityAsync(int reviewId, bool isVisible);
    Task<(bool Success, string? Error)> DeleteReviewAsync(int reviewId, string userId, bool isAdmin);
}
