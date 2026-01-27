using DAL.DAO;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public required string Name { get; set; }
    [Required, MaxLength(500)]
    public required string Description { get; set; }
    [Required]
    public required string Details { get; set; } // For Quill editor HTML content
    [Required, Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    [Required]
    public required ProductType Type { get; set; } // "note" or "software"
    public string? ImageUrl { get; set; }
    public string? ImageGalleryJson { get; set; } // Storing a list of URLs as a JSON string
    public string? PdfUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDeleted { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}