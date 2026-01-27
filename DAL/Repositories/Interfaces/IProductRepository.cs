using System.Collections.Generic;
using System.Threading.Tasks;

public interface IProductRepository
{
    /// <summary>
    /// Retrieves a list of products by their unique IDs.
    /// </summary>
    Task<List<Product>> GetByIdsAsync(IEnumerable<int> ids);

    /// <summary>
    /// Retrieves a single product by its ID.
    /// </summary>
    Task<Product?> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all products from the database.
    /// </summary>
    Task<IEnumerable<Product>> GetAllAsync();

    /// <summary>
    /// Adds a new product to the database context.
    /// </summary>
    Task AddAsync(Product product);

    /// <summary>
    /// Marks an existing product as modified in the database context.
    /// </summary>
    void Update(Product product);

    /// <summary>
    /// Permanently deletes a product from the database.
    /// </summary>
    Task DeletePermanentlyAsync(int id);
}
