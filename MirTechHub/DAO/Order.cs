public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public MTHUser User { get; set; }

    public decimal TotalAmount { get; set; }

    public string PaymentStatus { get; set; }
    public string PaymentMode { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;


    // Navigation
    public ICollection<OrderItem> OrderItems { get; set; }
}
