using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class ProductDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Details { get; set; }
    public decimal Price { get; set; }
    public required string Type { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> ImageGallery { get; set; } = new List<string>();
    public string? PdfUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDeleted { get; set; }
}

public class ProductCreateUpdateDto
{
    [Required, MaxLength(100)]
    public required string Name { get; set; }

    [Required, MaxLength(500)]
    public required string Description { get; set; }

    [Required]
    public required string Details { get; set; }

    [Required]
    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }
    public List<string>? ImageGallery { get; set; }
    public string? PdfUrl { get; set; }
    public bool IsFeatured { get; set; }
}
