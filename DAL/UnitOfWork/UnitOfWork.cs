public class UnitOfWork : IUnitOfWork
{
    private readonly MTHDbContext _context;

    public IProductRepository Products { get; }
    public IReviewRepository Reviews { get; }
    public IBlogPostRepository BlogPosts { get; }


    public UnitOfWork(MTHDbContext context,
                      IProductRepository productRepository,
                      IReviewRepository reviewRepository,
                      IBlogPostRepository blogPostRepository)
    {
        _context = context;
        Products = productRepository;
        Reviews = reviewRepository;
        BlogPosts = blogPostRepository;
    }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public int SaveChanges()
    {
        return _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}