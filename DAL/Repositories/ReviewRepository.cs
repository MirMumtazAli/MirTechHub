using DAL.DAO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ReviewRepository : IReviewRepository
{
    private readonly MTHDbContext _context;

    public ReviewRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public async Task DeleteAsync(int reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review != null)
        {
            _context.Reviews.Remove(review);
        }
    }

    public async Task<IEnumerable<Review>> GetAllAsync()
    {
        return await _context.Reviews
            .Include(r => r.Author)
            .OrderByDescending(r => r.Date)
            .ToListAsync();
    }

    public async Task<Review?> GetByIdAsync(int reviewId)
    {
        return await _context.Reviews
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.Id == reviewId);
    }

    public async Task<IEnumerable<Review>> GetByRelatedIdAsync(string type, string relatedId)
    {
        if (!System.Enum.TryParse<ReviewType>(type, true, out var reviewType))
        {
            return new List<Review>();
        }

        // Fetch all reviews for the item, including replies, and let the service layer structure them.
        return await _context.Reviews
            .Where(r => r.Type == reviewType && r.RelatedId == relatedId)
            .Include(r => r.Author)
            .OrderBy(r => r.Date) // Order by date to structure threads correctly
            .ToListAsync();
    }

    public void Update(Review review)
    {
        _context.Reviews.Update(review);
    }
}