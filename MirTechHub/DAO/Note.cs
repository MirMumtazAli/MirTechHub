public class Note
{
    public int Id { get; set; }

    public string Title { get; set; }
    public string? Description { get; set; }
    public string? Content { get; set; }
    public decimal Price { get; set; }
    public bool IsFree { get; set; }
    public string? FileUrl { get; set; }
    public int Pages { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;

    // Navigation
    public ICollection<Review> Reviews { get; set; }
}
