using System.ComponentModel.DataAnnotations;

public class BlogPostDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Excerpt { get; set; }
    public required string Content { get; set; }
    public required DateTime Date { get; set; }
    public required string Author { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDeleted { get; set; }
}

public class BlogPostCreateUpdateDto
{
    [Required]
    [StringLength(150)]
    public required string Title { get; set; }

    [Required]
    [StringLength(500)]
    public required string Excerpt { get; set; }

    [Required]
    public required string Content { get; set; }

    [Required]
    public required DateTime Date { get; set; }

    [Required]
    public required string Author { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
}