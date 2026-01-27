using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), 200)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] string? type)
    {
        var products = await _productService.GetProductsAsync(type);
        return Ok(products);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductDto), 201)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] ProductCreateUpdateDto productDto, [FromQuery] string type)
    {
        if (string.IsNullOrEmpty(type) || (type.ToLower() != "note" && type.ToLower() != "software"))
        {
            return BadRequest("A valid product type ('note' or 'software') must be provided as a query parameter.");
        }

        var newProduct = await _productService.CreateProductAsync(productDto, type);
        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] ProductCreateUpdateDto productDto)
    {
        var (product, error) = await _productService.UpdateProductAsync(id, productDto);
        if (error != null)
        {
            return NotFound(new { message = error });
        }
        return Ok(product);
    }

    [HttpPatch("{id}/delete")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> SoftDeleteProduct(int id)
    {
        var (success, error) = await _productService.SoftDeleteProductAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpPatch("{id}/restore")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> RestoreProduct(int id)
    {
        var (success, error) = await _productService.RestoreProductAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpPatch("{id}/toggle-featured")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ToggleFeatured(int id)
    {
        var (success, error) = await _productService.ToggleFeaturedStatusAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteProductPermanently(int id)
    {
        var (success, error) = await _productService.DeleteProductPermanentlyAsync(id);
        if (!success)
        {
            return NotFound(new { message = error });
        }
        return NoContent();
    }
}