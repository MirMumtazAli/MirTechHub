using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductImage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string ImageUrl { get; set; }

    // Foreign Key to Product
    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product Product { get; set; }
}