using DAL.DAO;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly MTHDbContext _context;

        public CartRepository(MTHDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cart>> GetUserCartAsync(int userId)
        {
            return await _context.CartItems
                .Where(c => c.UserId == userId && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Cart?> GetByIdAsync(int id)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
        }

        public async Task AddAsync(Cart cartItem)
        {
            await _context.CartItems.AddAsync(cartItem);
        }

        public void Update(Cart cartItem)
        {
            _context.CartItems.Update(cartItem);
        }

        public void SoftDelete(Cart cartItem)
        {
            cartItem.IsDeleted = true;
            _context.CartItems.Update(cartItem);
        }
    }

}
