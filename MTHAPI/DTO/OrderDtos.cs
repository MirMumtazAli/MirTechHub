using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// DTOs for Order-related operations

public class OrderItemDto
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public required string Type { get; set; }
    public int Quantity { get; set; }
}

public class OrderDto
{
    public required string Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }
    public required string Status { get; set; }
    public required List<OrderItemDto> Items { get; set; }
    public required UserSummaryDto User { get; set; }
}

public class UserSummaryDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
}

public class OrderCreateDto
{
    [Required]
    [MinLength(1, ErrorMessage = "An order must contain at least one item.")]
    public required List<OrderItemCreateDto> Items { get; set; }
}

public class OrderItemCreateDto
{
    [Required]
    public int ProductId { get; set; }

    // Default quantity to 1 if not provided
    public int Quantity { get; set; } = 1;
}

public class UpdateOrderStatusDto
{
    [Required]
    public required string Status { get; set; }
}
