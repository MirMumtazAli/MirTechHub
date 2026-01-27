using System.Collections.Generic;
using System.Threading.Tasks;

public interface IOrderService
{
    /// <summary>
    /// Retrieves all orders for a specific user, mapped to DTOs.
    /// </summary>
    Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId);

    /// <summary>
    /// Retrieves all orders in the system, mapped to DTOs.
    /// </summary>
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();

    /// <summary>
    /// Handles the business logic for creating a new order.
    /// </summary>
    /// <returns>A tuple containing the new Order DTO and a potential error message.</returns>
    Task<(OrderDto? Order, string? Error)> CreateOrderAsync(OrderCreateDto orderDto, string userId);

    /// <summary>
    /// Handles the business logic for updating an order's status.
    /// </summary>
    /// <returns>A tuple indicating success and a potential error message.</returns>
    Task<(bool Success, string? Error)> UpdateOrderStatusAsync(string orderId, string status);

    /// <summary>
    /// Handles the business logic for a user cancelling their own order.
    /// </summary>
    /// <returns>A tuple indicating success and a potential error message.</returns>
    Task<(bool Success, string? Error)> CancelOrderAsync(string orderId, string userId);
}
