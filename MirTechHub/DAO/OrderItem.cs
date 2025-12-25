public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; }

    public int? NoteId { get; set; }
    public Note Note { get; set; }

    public int? SoftwareId { get; set; }
    public Software Software { get; set; }

    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsDeleted { get; set; } = false;
}
