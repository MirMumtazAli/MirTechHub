using api.Data;
using DAL.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly MTHDbContext _context;

    public ReviewService(IReviewRepository reviewRepository, MTHDbContext context)
    {
        _reviewRepository = reviewRepository;
        _context = context;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
    {
        var reviews = await _reviewRepository.GetAllAsync();
        return reviews.Select(MapReviewToDto);
    }

    public async Task<IEnumerable<ReviewDto>> GetVisibleReviewsByRelatedIdAsync(string type, string relatedId)
    {
        var allReviewsForItem = await _reviewRepository.GetByRelatedIdAsync(type, relatedId);
        var visibleReviews = allReviewsForItem.Where(r => r.IsVisible).ToList();
        var reviewMap = visibleReviews.ToLookup(r => r.ParentId);

        return reviewMap[null] // Get top-level reviews
            .Select(r => MapReviewToDtoRecursive(r, reviewMap))
            .OrderByDescending(r => r.Date)
            .ToList();
    }

    public async Task<(ReviewDto? Review, string? Error)> CreateReviewAsync(ReviewCreateDto reviewDto, string authorId)
    {
        if (!Enum.TryParse<ReviewType>(reviewDto.Type, true, out var reviewType))
        {
            return (null, "Invalid review type specified.");
        }

        var newReview = new Review
        {
            RelatedId = reviewDto.RelatedId,
            Type = reviewType,
            Comment = reviewDto.Comment,
            Rating = reviewDto.Rating,
            Date = DateTime.UtcNow,
            IsVisible = true, // Default to visible
            AuthorId = authorId,
            ParentId = reviewDto.ParentId
        };

        await _reviewRepository.AddAsync(newReview);
        await _context.SaveChangesAsync();

        var completeReview = await _reviewRepository.GetByIdAsync(newReview.Id);

        return (MapReviewToDto(completeReview!), null);
    }

    public async Task<(bool Success, string? Error)> UpdateReviewAsync(int reviewId, ReviewUpdateDto reviewDto, string userId, bool isAdmin)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return (false, "Review not found.");
        }

        if (review.AuthorId != userId && !isAdmin)
        {
            return (false, "Forbidden");
        }

        review.Comment = reviewDto.Comment;
        if (review.Type == ReviewType.Product && reviewDto.Rating.HasValue)
        {
            review.Rating = reviewDto.Rating.Value;
        }

        _reviewRepository.Update(review);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> UpdateReviewVisibilityAsync(int reviewId, bool isVisible)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return (false, "Review not found.");
        }

        review.IsVisible = isVisible;
        _reviewRepository.Update(review);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> DeleteReviewAsync(int reviewId, string userId, bool isAdmin)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return (false, "Review not found.");
        }

        if (review.AuthorId != userId && !isAdmin)
        {
            return (false, "Forbidden");
        }

        await _reviewRepository.DeleteAsync(reviewId);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    private ReviewDto MapReviewToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            RelatedId = review.RelatedId,
            Type = review.Type,
            AuthorName = review.Author.Name,
            AuthorId = review.AuthorId,
            Rating = review.Rating,
            Comment = review.Comment,
            Date = review.Date,
            IsVisible = review.IsVisible,
            ParentId = review.ParentId
        };
    }

    private ReviewDto MapReviewToDtoRecursive(Review review, ILookup<int?, Review> reviewMap)
    {
        return new ReviewDto
        {
            Id = review.Id,
            RelatedId = review.RelatedId,
            Type = review.Type,
            AuthorName = review.Author.Name,
            AuthorId = review.AuthorId,
            Rating = review.Rating,
            Comment = review.Comment,
            Date = review.Date,
            IsVisible = review.IsVisible,
            ParentId = review.ParentId,
            Replies = reviewMap[review.Id]
                .Select(reply => MapReviewToDtoRecursive(reply, reviewMap))
                .OrderBy(r => r.Date)
                .ToList()
        };
    }
}