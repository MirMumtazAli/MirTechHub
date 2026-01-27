using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBlogPostRepository
{
    Task<BlogPost?> GetByIdAsync(string id);
    Task<IEnumerable<BlogPost>> GetAllAsync();
    Task AddAsync(BlogPost post);
    void Update(BlogPost post);
    Task DeletePermanentlyAsync(string id);
}
