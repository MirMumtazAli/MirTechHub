using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;

public class BlogPostService : IBlogPostService
{
    private readonly IBlogPostRepository _blogPostRepository;
    private readonly MTHDbContext _context;

    public BlogPostService(IBlogPostRepository blogPostRepository, MTHDbContext context)
    {
        _blogPostRepository = blogPostRepository;
        _context = context;
    }

    public async Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync()
    {
        var posts = await _blogPostRepository.GetAllAsync();
        return posts.Select(MapBlogPostToDto);
    }

    public async Task<BlogPostDto?> GetBlogPostByIdAsync(string id)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        return post == null ? null : MapBlogPostToDto(post);
    }

    public async Task<BlogPostDto> CreateBlogPostAsync(BlogPostCreateUpdateDto postDto)
    {
        var post = new BlogPost
        {
            Id = postDto.Title.ToLower().Replace(" ", "-").Substring(0, Math.Min(postDto.Title.Length, 50)), // Simple slug
            Title = postDto.Title,
            Excerpt = postDto.Excerpt,
            Content = postDto.Content,
            Date = postDto.Date,
            Author = postDto.Author,
            ImageUrl = postDto.ImageUrl,
            IsFeatured = postDto.IsFeatured,
            IsDeleted = false
        };

        await _blogPostRepository.AddAsync(post);
        await _context.SaveChangesAsync();
        return MapBlogPostToDto(post);
    }

    public async Task<(BlogPostDto? Post, string? Error)> UpdateBlogPostAsync(string id, BlogPostCreateUpdateDto postDto)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        if (post == null)
        {
            return (null, "Blog post not found.");
        }

        post.Title = postDto.Title;
        post.Excerpt = postDto.Excerpt;
        post.Content = postDto.Content;
        post.Date = postDto.Date;
        post.Author = postDto.Author;
        post.ImageUrl = postDto.ImageUrl;
        post.IsFeatured = postDto.IsFeatured;

        _blogPostRepository.Update(post);
        await _context.SaveChangesAsync();
        return (MapBlogPostToDto(post), null);
    }

    public async Task<(bool Success, string? Error)> SoftDeleteBlogPostAsync(string id)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        if (post == null) return (false, "Blog post not found.");

        post.IsDeleted = true;
        _blogPostRepository.Update(post);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> RestoreBlogPostAsync(string id)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        if (post == null) return (false, "Blog post not found.");

        post.IsDeleted = false;
        _blogPostRepository.Update(post);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> DeleteBlogPostPermanentlyAsync(string id)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        if (post == null) return (false, "Blog post not found.");

        await _blogPostRepository.DeletePermanentlyAsync(id);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> ToggleFeaturedStatusAsync(string id)
    {
        var post = await _blogPostRepository.GetByIdAsync(id);
        if (post == null) return (false, "Blog post not found.");

        post.IsFeatured = !post.IsFeatured;
        _blogPostRepository.Update(post);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    private BlogPostDto MapBlogPostToDto(BlogPost post)
    {
        return new BlogPostDto
        {
            Id = post.Id,
            Title = post.Title,
            Excerpt = post.Excerpt,
            Content = post.Content,
            Date = post.Date,
            Author = post.Author,
            ImageUrl = post.ImageUrl,
            IsFeatured = post.IsFeatured,
            IsDeleted = post.IsDeleted
        };
    }
}