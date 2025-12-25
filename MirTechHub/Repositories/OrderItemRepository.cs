using System;
using System.Collections.Generic;
using System.Text;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{


    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly MTHDbContext _context;

        public OrderItemRepository(MTHDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _context.OrderItems
                .Where(oi => !oi.IsDeleted)
                .Include(oi => oi.Order)
                .Include(oi => oi.Note)
                .Include(oi => oi.Software)
                .OrderByDescending(oi => oi.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(int orderId)
        {
            return await _context.OrderItems
                .Where(oi => oi.OrderId == orderId && !oi.IsDeleted)
                .Include(oi => oi.Note)
                .Include(oi => oi.Software)
                .OrderByDescending(oi => oi.CreatedAt)
                .ToListAsync();
        }

        public async Task<OrderItem?> GetByIdAsync(int id)
        {
            return await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Note)
                .Include(oi => oi.Software)
                .FirstOrDefaultAsync(oi => oi.Id == id && !oi.IsDeleted);
        }

        public async Task AddAsync(OrderItem orderItem)
        {
            await _context.OrderItems.AddAsync(orderItem);
        }

        public void Update(OrderItem orderItem)
        {
            _context.OrderItems.Update(orderItem);
        }

        public void SoftDelete(OrderItem orderItem)
        {
            orderItem.IsDeleted = true;
            _context.OrderItems.Update(orderItem);
        }
    }

}
