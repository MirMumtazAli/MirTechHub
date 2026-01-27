using DAL.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IProductRepository productRepository, IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync(string? type)
    {
        var products = await _productRepository.GetAllAsync();
        if (!string.IsNullOrEmpty(type))
        {
            products = products.Where(p => string.Equals(p.Type.ToString(), type, StringComparison.OrdinalIgnoreCase));
        }
        return products.Select(MapProductToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : MapProductToDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(ProductCreateUpdateDto productDto, string type)
    {
        if (!Enum.TryParse<ProductType>(type, true, out var productType))
        {
            throw new ArgumentException("Invalid product type specified.");
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Details = productDto.Details,
            Price = productDto.Price,
            Type = productType,
            ImageUrl = productDto.ImageUrl,
            PdfUrl = productDto.PdfUrl,
            IsFeatured = productDto.IsFeatured,
            IsDeleted = false,
            ImageGalleryJson = productDto.ImageGallery != null ? JsonSerializer.Serialize(productDto.ImageGallery) : null
        };

        await _productRepository.AddAsync(product);
        await _unitOfWork.CompleteAsync();
        return MapProductToDto(product);
    }

    public async Task<(ProductDto? Product, string? Error)> UpdateProductAsync(int id, ProductCreateUpdateDto productDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            return (null, "Product not found.");
        }

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Details = productDto.Details;
        product.Price = productDto.Price;
        product.ImageUrl = productDto.ImageUrl;
        product.PdfUrl = productDto.PdfUrl;
        product.IsFeatured = productDto.IsFeatured;
        product.ImageGalleryJson = productDto.ImageGallery != null ? JsonSerializer.Serialize(productDto.ImageGallery) : null;

        _productRepository.Update(product);
        await _unitOfWork.CompleteAsync();
        return (MapProductToDto(product), null);
    }

    public async Task<(bool Success, string? Error)> SoftDeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return (false, "Product not found.");

        product.IsDeleted = true;
        _productRepository.Update(product);
        await _unitOfWork.CompleteAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> RestoreProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return (false, "Product not found.");

        product.IsDeleted = false;
        _productRepository.Update(product);
        await _unitOfWork.CompleteAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> DeleteProductPermanentlyAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return (false, "Product not found.");

        await _productRepository.DeletePermanentlyAsync(id);
        await _unitOfWork.CompleteAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> ToggleFeaturedStatusAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return (false, "Product not found.");

        product.IsFeatured = !product.IsFeatured;
        _productRepository.Update(product);
        await _unitOfWork.CompleteAsync();
        return (true, null);
    }

    private ProductDto MapProductToDto(Product product)
    {
        var imageGallery = new List<string>();
        if (!string.IsNullOrEmpty(product.ImageGalleryJson))
        {
            try
            {
                imageGallery = JsonSerializer.Deserialize<List<string>>(product.ImageGalleryJson) ?? new List<string>();
            }
            catch
            {
                // Ignore deserialization errors, return empty list
            }
        }

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Details = product.Details,
            Price = product.Price,
            Type = product.Type.ToString(),
            ImageUrl = product.ImageUrl,
            ImageGallery = imageGallery,
            PdfUrl = product.PdfUrl,
            IsFeatured = product.IsFeatured,
            IsDeleted = product.IsDeleted
        };
    }
}