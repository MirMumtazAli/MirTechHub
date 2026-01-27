using System.Collections.Generic;
using System.Threading.Tasks;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetProductsAsync(string? type);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(ProductCreateUpdateDto productDto, string type);
    Task<(ProductDto? Product, string? Error)> UpdateProductAsync(int id, ProductCreateUpdateDto productDto);
    Task<(bool Success, string? Error)> SoftDeleteProductAsync(int id);
    Task<(bool Success, string? Error)> RestoreProductAsync(int id);
    Task<(bool Success, string? Error)> DeleteProductPermanentlyAsync(int id);
    Task<(bool Success, string? Error)> ToggleFeaturedStatusAsync(int id);
}
