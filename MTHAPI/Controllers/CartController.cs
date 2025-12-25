using DAL.DAO;
using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/cart/user/1
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCart(int userId)
        {
            var cart = await _unitOfWork.CartItems.GetUserCartAsync(userId);
            return Ok(cart);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<IActionResult> AddToCart(Cart cartItem)
        {
            await _unitOfWork.CartItems.AddAsync(cartItem);
            await _unitOfWork.CompleteAsync();

            return Ok(cartItem);
        }

        // PUT: api/cart/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Cart updated)
        {
            var cartItem = await _unitOfWork.CartItems.GetByIdAsync(id);
            if (cartItem == null) return NotFound();

            cartItem.Price = updated.Price;

            _unitOfWork.CartItems.Update(cartItem);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // SOFT DELETE (Remove from cart)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var cartItem = await _unitOfWork.CartItems.GetByIdAsync(id);
            if (cartItem == null) return NotFound();

            _unitOfWork.CartItems.SoftDelete(cartItem);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}