using System.ComponentModel.DataAnnotations.Schema;

// This class represents the join table between Order and Product
public class OrderItem
{
    // Composite Primary Key (configured in DbContext)
    public string OrderId { get; set; }
    public int ProductId { get; set; }

    [ForeignKey("OrderId")]
    public virtual Order Order { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product Product { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
}