using Microsoft.AspNetCore.Mvc;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;

namespace IndustrialCatalog.API.Controllers;

/// <summary>
/// Public catalog endpoints for exploring machinery, categories, and technical specifications.
/// </summary>
public class CatalogController : BaseApiController
{
    private readonly ICatalogService _catalogService;

    public CatalogController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>
    /// Retrieves all active machinery categories with their dynamic specification schemas and product counts.
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories(CancellationToken ct)
    {
        var result = await _catalogService.GetCategoriesAsync(ct);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves category details and its defined technical specification attributes by category slug.
    /// </summary>
    /// <param name="slug">Category slug (e.g. cnc-machining-centers, edge-banding-machines)</param>
    /// <param name="ct">Cancellation token</param>
    [HttpGet("categories/slug/{slug}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryBySlug(string slug, CancellationToken ct)
    {
        var result = await _catalogService.GetCategoryBySlugAsync(slug, ct);
        if (result == null) return NotFound(new { message = $"Category '{slug}' not found." });
        return Ok(result);
    }

    /// <summary>
    /// Retrieves all authorized machinery manufacturers and brands.
    /// </summary>
    [HttpGet("manufacturers")]
    public async Task<ActionResult<List<ManufacturerDto>>> GetManufacturers(CancellationToken ct)
    {
        var result = await _catalogService.GetManufacturersAsync(ct);
        return Ok(result);
    }

    /// <summary>
    /// Searches and filters the machinery catalog with pagination, dynamic JSONB specs, and sorting.
    /// </summary>
    [HttpGet("products")]
    public async Task<ActionResult<PaginatedList<ProductDto>>> GetProducts(
        [FromQuery] ProductFilterParamsDto filter,
        CancellationToken ct)
    {
        var result = await _catalogService.GetProductsAsync(filter, ct);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves single machinery model details by UUID.
    /// </summary>
    [HttpGet("products/{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetProductById(Guid id, CancellationToken ct)
    {
        var result = await _catalogService.GetProductByIdAsync(id, ct);
        if (result == null) return NotFound(new { message = "Machinery model not found." });
        return Ok(result);
    }

    /// <summary>
    /// Retrieves detailed machinery specifications, gallery, and brochures by URL slug.
    /// </summary>
    /// <param name="slug">Product slug (e.g. wts-prime-1325-atc-cnc-router)</param>
    /// <param name="ct">Cancellation token</param>
    [HttpGet("products/slug/{slug}")]
    public async Task<ActionResult<ProductDto>> GetProductBySlug(string slug, CancellationToken ct)
    {
        var result = await _catalogService.GetProductBySlugAsync(slug, ct);
        if (result == null) return NotFound(new { message = $"Machinery model '{slug}' not found." });
        return Ok(result);
    }

    /// <summary>
    /// Retrieves public site settings (brand logo, showroom addresses, contacts, global parameters).
    /// </summary>
    [HttpGet("settings")]
    public async Task<ActionResult<List<SiteSettingDto>>> GetSettings(CancellationToken ct)
    {
        var settings = await _catalogService.GetPublicSiteSettingsAsync(ct);
        return Ok(settings);
    }
}
