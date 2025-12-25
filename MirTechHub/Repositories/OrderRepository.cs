using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

public class OrderRepository : IOrderRepository
{
    private readonly MTHDbContext _context;

    public OrderRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Where(o => !o.IsDeleted)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Note)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Software)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId && !o.IsDeleted)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Note)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Software)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
    }

    public void SoftDelete(Order order)
    {
        order.IsDeleted = true;
        _context.Orders.Update(order);
    }
}
