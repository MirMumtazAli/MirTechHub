using Microsoft.EntityFrameworkCore;

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

    public void Update(Review review)
    {
        _context.Reviews.Update(review);
    }
}
