using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.API.Controllers;

/// <summary>
/// Administrative platform endpoints for equipment catalog management, dynamic attribute building, and commercial RFQs.
/// </summary>
[AllowAnonymous]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    private readonly ICloudinaryService _cloudinaryService;

    public AdminController(IAdminService adminService, ICloudinaryService cloudinaryService)
    {
        _adminService = adminService;
        _cloudinaryService = cloudinaryService;
    }

    /// <summary>
    /// Returns executive KPI metrics: total models, categories, pending RFQs, and pipeline valuation ($).
    /// </summary>
    [HttpGet("dashboard/summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary(CancellationToken ct)
    {
        var summary = await _adminService.GetDashboardSummaryAsync(ct);
        return Ok(summary);
    }

    /// <summary>
    /// Creates a new machinery equipment entry with category-specific JSONB technical specifications.
    /// </summary>
    [HttpPost("products")]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto, CancellationToken ct)
    {
        var product = await _adminService.CreateProductAsync(dto, ct);
        return Ok(product);
    }

    /// <summary>
    /// Updates an existing machinery equipment model and its technical specifications.
    /// </summary>
    [HttpPut("products/{id:guid}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(Guid id, [FromBody] CreateProductDto dto, CancellationToken ct)
    {
        var product = await _adminService.UpdateProductAsync(id, dto, ct);
        return Ok(product);
    }

    /// <summary>
    /// Toggles the homepage featured status of a machinery equipment model.
    /// </summary>
    [HttpPatch("products/{id:guid}/featured")]
    [HttpPut("products/{id:guid}/featured")]
    public async Task<ActionResult<ProductDto>> ToggleProductFeatured(Guid id, [FromBody] ToggleFeaturedDto dto, CancellationToken ct)
    {
        var product = await _adminService.ToggleProductFeaturedAsync(id, dto.IsFeatured, ct);
        return Ok(product);
    }

    /// <summary>
    /// Soft-deletes a machinery equipment entry from active catalog.
    /// </summary>
    [HttpDelete("products/{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        var success = await _adminService.DeleteProductAsync(id, ct);
        if (!success) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Creates a new machinery category.
    /// </summary>
    [HttpPost("categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto, CancellationToken ct)
    {
        var category = await _adminService.CreateCategoryAsync(dto, ct);
        return Ok(category);
    }

    /// <summary>
    /// Updates an existing machinery category (name, image URL, display order).
    /// </summary>
    [HttpPut("categories/{id:guid}")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto, CancellationToken ct)
    {
        var category = await _adminService.UpdateCategoryAsync(id, dto, ct);
        return Ok(category);
    }

    /// <summary>
    /// Soft deletes a machinery category.
    /// </summary>
    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id, CancellationToken ct)
    {
        var success = await _adminService.DeleteCategoryAsync(id, ct);
        if (!success) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Dynamic Attribute Builder: Saves and configures the technical specification schema for a category.
    /// </summary>
    /// <param name="id">Category UUID</param>
    /// <param name="attributes">List of attributes (Label, Key, DataType, Unit, Options, IsFilterable)</param>
    /// <param name="ct">Cancellation token</param>
    [HttpPost("categories/{id:guid}/attributes")]
    public async Task<ActionResult<List<CategoryAttributeDto>>> SaveCategoryAttributes(
        Guid id,
        [FromBody] List<CreateCategoryAttributeDto> attributes,
        CancellationToken ct)
    {
        var result = await _adminService.SaveCategoryAttributesAsync(id, attributes, ct);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves all commercial RFQs for administrative review.
    /// </summary>
    [HttpGet("quotes")]
    public async Task<ActionResult<List<RFQDto>>> GetQuotes(CancellationToken ct)
    {
        var quotes = await _adminService.GetAdminRfqsAsync(ct);
        return Ok(quotes);
    }

    /// <summary>
    /// Updates the commercial status of an RFQ and logs an internal engineering note.
    /// </summary>
    [HttpPut("quotes/{id:guid}/status")]
    public async Task<ActionResult<RFQDto>> UpdateQuoteStatus(Guid id, [FromBody] UpdateRFQStatusDto dto, CancellationToken ct)
    {
        var quote = await _adminService.UpdateRfqStatusAsync(id, dto, ct);
        return Ok(quote);
    }

    /// <summary>
    /// Assigns a Senior Sales Director or Machinery Application Manager to an RFQ.
    /// </summary>
    [HttpPost("quotes/{id:guid}/assign")]
    public async Task<ActionResult<RFQDto>> AssignQuote(Guid id, [FromBody] AssignRFQDto dto, CancellationToken ct)
    {
        var quote = await _adminService.AssignRfqAsync(id, dto, ct);
        return Ok(quote);
    }

    #region User Management

    /// <summary>
    /// Retrieves all registered platform users with their administrative roles.
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetUsers(CancellationToken ct)
    {
        var users = await _adminService.GetUsersAsync(ct);
        return Ok(users);
    }

    /// <summary>
    /// Creates a new staff or customer account with designated role.
    /// </summary>
    [HttpPost("users")]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto, CancellationToken ct)
    {
        var user = await _adminService.CreateUserAsync(dto, ct);
        return Ok(user);
    }

    /// <summary>
    /// Updates the access role of a platform user.
    /// </summary>
    [HttpPut("users/{id:guid}/role")]
    public async Task<ActionResult<UserDto>> UpdateUserRole(Guid id, [FromBody] UserRole role, CancellationToken ct)
    {
        var user = await _adminService.UpdateUserRoleAsync(id, role, ct);
        return Ok(user);
    }

    /// <summary>
    /// Toggles active/suspended account status for a user.
    /// </summary>
    [HttpPut("users/{id:guid}/status")]
    public async Task<ActionResult<UserDto>> ToggleUserStatus(Guid id, CancellationToken ct)
    {
        var user = await _adminService.ToggleUserStatusAsync(id, ct);
        return Ok(user);
    }

    #endregion

    #region CMS & Site Settings

    /// <summary>
    /// Retrieves global platform settings and CMS configurations.
    /// </summary>
    [HttpGet("settings")]
    public async Task<ActionResult<List<SiteSettingDto>>> GetSettings(CancellationToken ct)
    {
        var settings = await _adminService.GetSiteSettingsAsync(ct);
        return Ok(settings);
    }

    /// <summary>
    /// Updates platform settings (hero content, contact info, SEO metadata).
    /// </summary>
    [HttpPut("settings")]
    public async Task<ActionResult<List<SiteSettingDto>>> UpdateSettings([FromBody] List<SiteSettingDto> settings, CancellationToken ct)
    {
        var updated = await _adminService.UpdateSiteSettingsAsync(settings, ct);
        return Ok(updated);
    }

    #endregion

    #region Bulk CSV Import / Export

    /// <summary>
    /// Uploads an image to Cloudinary and returns its permanent CDN secure URL.
    /// </summary>
    [HttpPost("upload-image")]
    [AllowAnonymous]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string? folder, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No image file provided." });
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP, SVG, GIF." });
        }

        if (file.Length > 15 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 15 MB limit." });
        }

        try
        {
            using var stream = file.OpenReadStream();
            var targetFolder = string.IsNullOrWhiteSpace(folder) ? "uws-machinery" : folder;
            var result = await _cloudinaryService.UploadImageAsync(stream, file.FileName, targetFolder, ct);
            return Ok(new
            {
                url = result.SecureUrl,
                secureUrl = result.SecureUrl,
                publicId = result.PublicId,
                format = result.Format,
                width = result.Width,
                height = result.Height,
                bytes = result.Bytes
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to upload image to Cloudinary.", error = ex.Message });
        }
    }

    /// <summary>
    /// Deletes an image from Cloudinary using its publicId or full URL.
    /// </summary>
    [HttpDelete("delete-image")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteImage([FromQuery] string publicId, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest(new { message = "Public ID or image URL is required." });
        }

        try
        {
            var success = await _cloudinaryService.DeleteImageAsync(publicId, ct);
            return Ok(new { success, message = success ? "Image successfully removed from Cloudinary." : "Image not found or could not be removed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to delete image from Cloudinary.", error = ex.Message });
        }
    }

    /// <summary>
    /// Fallback POST endpoint for deleting an image from Cloudinary.
    /// </summary>
    [HttpPost("delete-image")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteImagePost([FromBody] DeleteImageRequestDto dto, CancellationToken ct)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.PublicId))
        {
            return BadRequest(new { message = "Public ID or image URL is required." });
        }

        try
        {
            var success = await _cloudinaryService.DeleteImageAsync(dto.PublicId, ct);
            return Ok(new { success, message = success ? "Image successfully removed from Cloudinary." : "Image not found or could not be removed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to delete image from Cloudinary.", error = ex.Message });
        }
    }

    /// <summary>
    /// Exports all machinery catalog entries to CSV.
    /// </summary>
    [HttpGet("products/export")]
    public async Task<IActionResult> ExportProductsCsv(CancellationToken ct)
    {
        var csvBytes = await _adminService.ExportProductsCsvAsync(ct);
        return File(csvBytes, "text/csv", $"woodtech-machinery-catalog-{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    /// <summary>
    /// Bulk imports machinery catalog models from a CSV file.
    /// </summary>
    [HttpPost("products/import")]
    public async Task<ActionResult<BulkImportResultDto>> ImportProductsCsv(IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Please upload a valid CSV file.");
        }

        using var reader = new StreamReader(file.OpenReadStream());
        var csvContent = await reader.ReadToEndAsync(ct);
        var result = await _adminService.ImportProductsCsvAsync(csvContent, ct);
        return Ok(result);
    }

    #endregion
}

public class DeleteImageRequestDto
{
    public string PublicId { get; set; } = string.Empty;
}
