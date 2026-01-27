using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class BlogPostRepository : IBlogPostRepository
{
    private readonly MTHDbContext _context;

    public BlogPostRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BlogPost>> GetAllAsync()
    {
        return await _context.BlogPosts.ToListAsync();
    }

    public async Task<BlogPost?> GetByIdAsync(string id)
    {
        return await _context.BlogPosts.FindAsync(id);
    }

    public async Task AddAsync(BlogPost post)
    {
        await _context.BlogPosts.AddAsync(post);
    }

    public void Update(BlogPost post)
    {
        _context.BlogPosts.Update(post);
    }

    public async Task DeletePermanentlyAsync(string id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post != null)
        {
            _context.BlogPosts.Remove(post);
        }
    }
}
