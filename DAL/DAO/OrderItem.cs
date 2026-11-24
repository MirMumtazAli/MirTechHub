using System.ComponentModel.DataAnnotations.Schema;

public class OrderItem
{
    // Composite Primary Key (configured in DbContext)
    public string OrderId { get; set; } = string.Empty;

    public int ProductId { get; set; }

    [ForeignKey(nameof(OrderId))]
    public virtual Order Order { get; set; } = null!;

    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
}
