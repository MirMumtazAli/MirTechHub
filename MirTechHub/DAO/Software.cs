public class Software
{
    public int Id { get; set; }

    public string Name { get; set; }
    public string Description { get; set; }
    public string TechStack { get; set; }
    public decimal Price { get; set; }
    public bool IsFree { get; set; }
    public string SourceCodeUrl { get; set; }
    public string DemoUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
    // Navigation
    public ICollection<Review> Reviews { get; set; }
}
