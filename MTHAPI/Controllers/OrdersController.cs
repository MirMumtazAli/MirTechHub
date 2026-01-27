using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<OrderDto>), 200)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User identifier not found.");
        }

        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<OrderDto>), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), 201)]
    [ProducesResponseType(typeof(object), 400)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] OrderCreateDto orderDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var (newOrder, error) = await _orderService.CreateOrderAsync(orderDto, userId);

        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        return CreatedAtAction(nameof(GetUserOrders), new { id = newOrder!.Id }, newOrder);
    }

    [HttpPut("{orderId}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(object), 404)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] UpdateOrderStatusDto statusDto)
    {
        var (success, error) = await _orderService.UpdateOrderStatusAsync(orderId, statusDto.Status);

        if (!success)
        {
            // Use NotFound for errors like "Order not found" and BadRequest for "Invalid status"
            if (error != null && error.Contains("Invalid"))
            {
                return BadRequest(new { message = error });
            }
            return NotFound(new { message = error });
        }

        return NoContent();
    }

    [HttpPut("{orderId}/cancel")]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(object), 400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> CancelOrder(string orderId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var (success, error) = await _orderService.CancelOrderAsync(orderId, userId);

        if (!success)
        {
            return BadRequest(new { message = error });
        }

        return NoContent();
    }
}
