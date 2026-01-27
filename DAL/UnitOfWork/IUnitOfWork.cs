public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    IReviewRepository Reviews { get; }
    IBlogPostRepository BlogPosts { get; }

    Task<int> CompleteAsync();  // This was missing!
    int Complete();

    Task<int> SaveChangesAsync();
    int SaveChanges();
}