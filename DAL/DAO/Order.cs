using DAL.DAO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Order
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; }

    public DateTime Date { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    [Required]
    public OrderStatus Status { get; set; }

    // Foreign Key to User
    public string UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual ApplicationUser User { get; set; }

    // Navigation property for the join table
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}