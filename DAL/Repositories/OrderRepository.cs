using Microsoft.EntityFrameworkCore;

public class OrdersRepository : IOrdersRepository
{
    private readonly MTHDbContext _context;

    public OrdersRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.Date)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(string orderId)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(string userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.Date)
            .ToListAsync();
    }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
    }
}
