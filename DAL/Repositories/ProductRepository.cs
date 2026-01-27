using Microsoft.EntityFrameworkCore;

public class ProductRepository : IProductRepository
{
    private readonly MTHDbContext _context;

    public ProductRepository(MTHDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetByIdsAsync(IEnumerable<int> ids)
    {
        return await _context.Products
            .Where(p => ids.Contains(p.Id))
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public async Task DeletePermanentlyAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product != null)
        {
            _context.Products.Remove(product);
        }
    }
}
