using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DAL.UnitOfWork;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderItemController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/orderitem
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _unitOfWork.OrderItems.GetAllAsync();
            return Ok(items);
        }

        // GET: api/orderitem/order/5
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrder(int orderId)
        {
            var items = await _unitOfWork.OrderItems.GetByOrderIdAsync(orderId);
            return Ok(items);
        }

        // GET: api/orderitem/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _unitOfWork.OrderItems.GetByIdAsync(id);
            if (item == null) return NotFound();

            return Ok(item);
        }

        // POST: api/orderitem
        [HttpPost]
        public async Task<IActionResult> Create(OrderItem item)
        {
            item.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.OrderItems.AddAsync(item);
            await _unitOfWork.CompleteAsync();

            return Ok(item);
        }

        // PUT: api/orderitem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrderItem updated)
        {
            var item = await _unitOfWork.OrderItems.GetByIdAsync(id);
            if (item == null) return NotFound();

            item.Price = updated.Price;
            item.NoteId = updated.NoteId;
            item.SoftwareId = updated.SoftwareId;

            _unitOfWork.OrderItems.Update(item);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // SOFT DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _unitOfWork.OrderItems.GetByIdAsync(id);
            if (item == null) return NotFound();

            _unitOfWork.OrderItems.SoftDelete(item);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }

}
