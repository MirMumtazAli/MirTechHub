using DAL.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MTHAPI.DTO.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MTHAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/order
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();
            return Ok(orders);
        }

        // GET: api/order/user/1
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var orders = await _unitOfWork.Orders.GetByUserIdAsync(userId);
            return Ok(orders);
        }

        // GET: api/order/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            return Ok(order);
        }

        // POST: api/order
        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            order.PaymentStatus = "Pending";

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();

            return Ok(order);
        }

        // PUT: api/order/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order updated)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            order.PaymentStatus = updated.PaymentStatus;
            order.PaymentMode = updated.PaymentMode;

            _unitOfWork.Orders.Update(order);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // SOFT DELETE (Admin / Cancel Order)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();

            _unitOfWork.Orders.SoftDelete(order);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
