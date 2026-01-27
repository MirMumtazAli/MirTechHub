using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBlogPostService
{
    Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync();
    Task<BlogPostDto?> GetBlogPostByIdAsync(string id);
    Task<BlogPostDto> CreateBlogPostAsync(BlogPostCreateUpdateDto postDto);
    Task<(BlogPostDto? Post, string? Error)> UpdateBlogPostAsync(string id, BlogPostCreateUpdateDto postDto);
    Task<(bool Success, string? Error)> SoftDeleteBlogPostAsync(string id);
    Task<(bool Success, string? Error)> RestoreBlogPostAsync(string id);
    Task<(bool Success, string? Error)> DeleteBlogPostPermanentlyAsync(string id);
    Task<(bool Success, string? Error)> ToggleFeaturedStatusAsync(string id);
}
