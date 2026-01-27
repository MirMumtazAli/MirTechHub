public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetAllAsync();
    Task<Review?> GetByIdAsync(int reviewId);
    Task AddAsync(Review review);
    void Update(Review review);
    Task DeleteAsync(int reviewId);
}
