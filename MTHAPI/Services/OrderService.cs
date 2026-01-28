using api.Data;
using DAL.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class OrderService : IOrderService
{
    private readonly IOrdersRepository _ordersRepository;
    private readonly IProductRepository _productRepository;
    private readonly MTHDbContext _context;

    public OrderService(IOrdersRepository ordersRepository, IProductRepository productRepository, MTHDbContext context)
    {
        _ordersRepository = ordersRepository;
        _productRepository = productRepository;
        _context = context;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _ordersRepository.GetAllAsync();
        return orders.Select(MapOrderToDto);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
    {
        var orders = await _ordersRepository.GetByUserIdAsync(userId);
        return orders.Select(MapOrderToDto);
    }

    public async Task<(OrderDto? Order, string? Error)> CreateOrderAsync(OrderCreateDto orderDto, string userId)
    {
        var productIds = orderDto.Items.Select(i => i.ProductId).Distinct();
        var products = await _productRepository.GetByIdsAsync(productIds);

        if (products.Count != productIds.Count())
        {
            return (null, "One or more products in the order could not be found.");
        }

        var newOrder = new Order
        {
            Id = $"ORD-{Guid.NewGuid().ToString().ToUpper().Substring(0, 8)}",
            Date = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            UserId = userId
        };

        decimal total = 0;
        foreach (var itemDto in orderDto.Items)
        {
            var product = products.First(p => p.Id == itemDto.ProductId);
            var orderItem = new OrderItem
            {
                OrderId = newOrder.Id,
                ProductId = product.Id,
                Quantity = itemDto.Quantity,
                Price = product.Price // Capture price at time of purchase
            };
            newOrder.OrderItems.Add(orderItem);
            total += product.Price * itemDto.Quantity;
        }

        newOrder.Total = total;

        await _ordersRepository.AddAsync(newOrder);
        await _context.SaveChangesAsync();

        // Refetch to ensure all relationships are loaded for the DTO mapping
        var completeOrder = await _ordersRepository.GetByIdAsync(newOrder.Id);

        return (MapOrderToDto(completeOrder!), null);
    }

    public async Task<(bool Success, string? Error)> UpdateOrderStatusAsync(string orderId, string status)
    {
        if (!Enum.TryParse<OrderStatus>(status, true, out var newStatus))
        {
            return (false, "Invalid status provided.");
        }

        var order = await _ordersRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            return (false, "Order not found.");
        }

        order.Status = newStatus;
        _ordersRepository.Update(order);
        await _context.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(bool Success, string? Error)> CancelOrderAsync(string orderId, string userId)
    {
        var order = await _ordersRepository.GetByIdAsync(orderId);

        if (order == null)
        {
            return (false, "Order not found.");
        }

        if (order.UserId != userId)
        {
            return (false, "You do not have permission to cancel this order.");
        }

        if (order.Status != OrderStatus.Pending)
        {
            return (false, "Only orders with a 'Pending' status can be cancelled.");
        }

        order.Status = OrderStatus.Cancelled;
        _ordersRepository.Update(order);
        await _context.SaveChangesAsync();

        return (true, null);
    }

    private OrderDto MapOrderToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Date = order.Date,
            Total = order.Total,
            Status = order.Status.ToString(),
            User = new UserSummaryDto
            {
                Id = order.User.Id,
                Name = order.User.Name
            },
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                Name = oi.Product.Name,
                Price = oi.Price,
                Type = oi.Product.Type.ToString(),
                Quantity = oi.Quantity
            }).ToList()
        };
    }

    //private OrderDto MapOrderToDto(Order order)
    //{
    //    if (order == null)
    //    {
    //        throw new ArgumentNullException(nameof(order), "Order cannot be null");
    //    }

    //    if (order.User == null)
    //    {
    //        throw new InvalidOperationException($"Order {order.Id} has no User loaded");
    //    }

    //    if (order.OrderItems == null)
    //    {
    //        throw new InvalidOperationException($"Order {order.Id} has no OrderItems loaded");
    //    }

    //    return new OrderDto
    //    {
    //        Id = order.Id,
    //        Date = order.Date,
    //        Total = order.Total,
    //        Status = order.Status.ToString(),
    //        User = new UserSummaryDto
    //        {
    //            Id = order.User.Id,
    //            Name = order.User.Name
    //        },
    //        Items = order.OrderItems.Select(oi => {
    //            if (oi.Product == null)
    //            {
    //                throw new InvalidOperationException($"OrderItem for ProductId {oi.ProductId} has no Product loaded");
    //            }
    //            return new OrderItemDto
    //            {
    //                ProductId = oi.ProductId,
    //                Name = oi.Product.Name,
    //                Price = oi.Price,
    //                Type = oi.Product.Type.ToString(),
    //                Quantity = oi.Quantity
    //            };
    //        }).ToList()
    //    };
    //}
}