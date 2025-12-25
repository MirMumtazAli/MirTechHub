using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MTHAPI.DTO.Order;
using System.Linq;

namespace MTHAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // ================= GET ALL ORDERS =================
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();
            var result = orders.Select(o => new OrderReadDto
            {
                Id = o.Id,
                UserId = o.UserId,
                TotalAmount = o.TotalAmount,
                PaymentStatus = o.PaymentStatus,
                OrderDate = o.OrderDate
            }).ToList();

            return Ok(result);
        }

        // ================= GET ORDER BY ID =================
        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            var dto = new OrderReadDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                PaymentStatus = order.PaymentStatus,
                OrderDate = order.OrderDate
            };

            return Ok(dto);
        }

        // ================= CANCEL ORDER =================
        [HttpPut("orders/cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            order.PaymentStatus = "Cancelled";
            _unitOfWork.Orders.Update(order);
            await _unitOfWork.CompleteAsync();

            return Ok("Order cancelled");
        }

        // ================= SOFT DELETE ORDER =================
        [HttpDelete("orders/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            // Soft delete order
            _unitOfWork.Orders.SoftDelete(order);

            // Optional: also soft delete related OrderItems
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    _unitOfWork.OrderItems.SoftDelete(item);
                }
            }

            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
