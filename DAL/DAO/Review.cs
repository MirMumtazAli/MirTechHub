using DAL.DAO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Review
{
    [Key]
    public int Id { get; set; }

    [Required]
    public required string RelatedId { get; set; }

    [Required]
    public ReviewType Type { get; set; }

    [Required]
    public required string Comment { get; set; }

    public int? Rating { get; set; } // Nullable for blog comments

    public DateTime Date { get; set; }

    public bool IsVisible { get; set; } = true;

    // Foreign key for ApplicationUser
    [Required]
    public required string AuthorId { get; set; }

    [ForeignKey("AuthorId")]
    public virtual ApplicationUser Author { get; set; } = null!;

    // Self-referencing relationship for replies
    public int? ParentId { get; set; }

    [ForeignKey("ParentId")]
    public virtual Review? ParentReview { get; set; }
    public virtual ICollection<Review> Replies { get; set; } = new List<Review>();
}