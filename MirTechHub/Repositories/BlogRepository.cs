using DAL.DAO;
using Microsoft.EntityFrameworkCore;
using System;

public class BlogRepository : IBlogRepository
{
    private readonly MTHDbContext _context;

    public BlogRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Blog>> GetAllAsync()
    {
        return await _context.Blogs
            .Where(b => !b.IsDeleted)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<Blog?> GetByIdAsync(int id)
    {
        return await _context.Blogs
            .FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted);
    }

    public async Task<Blog?> GetBySlugAsync(string slug)
    {
        return await _context.Blogs
            .FirstOrDefaultAsync(b => b.Slug == slug && !b.IsPublished && !b.IsDeleted);
    }

    public async Task AddAsync(Blog blog)
    {
        await _context.Blogs.AddAsync(blog);
    }

    public void Update(Blog blog)
    {
        _context.Blogs.Update(blog);
    }

    public void SoftDelete(Blog blog)
    {
        blog.IsDeleted = true;
        _context.Blogs.Update(blog);
    }
}
