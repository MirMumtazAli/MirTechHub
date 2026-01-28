using System.Collections.Generic;
using System.Threading.Tasks;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetAllAsync();
    Task<Review?> GetByIdAsync(int reviewId);
    Task<IEnumerable<Review>> GetByRelatedIdAsync(string type, string relatedId);
    Task AddAsync(Review review);
    void Update(Review review);
    Task DeleteAsync(int reviewId);
}