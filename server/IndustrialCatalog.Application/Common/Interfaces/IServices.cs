using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.Common.Interfaces;

public interface ICatalogService
{
    Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<CategoryDto?> GetCategoryBySlugAsync(string slug, CancellationToken ct = default);
    Task<List<ManufacturerDto>> GetManufacturersAsync(CancellationToken ct = default);
    Task<PaginatedList<ProductDto>> GetProductsAsync(ProductFilterParamsDto filter, CancellationToken ct = default);
    Task<ProductDto?> GetProductBySlugAsync(string slug, CancellationToken ct = default);
    Task<ProductDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<SiteSettingDto>> GetPublicSiteSettingsAsync(CancellationToken ct = default);
}

public interface IRfqService
{
    Task<RFQDto> SubmitRfqAsync(SubmitRFQDto dto, Guid? userId = null, CancellationToken ct = default);
    Task<List<RFQDto>> GetUserRfqsAsync(Guid userId, CancellationToken ct = default);
    Task<RFQDto?> GetRfqByReferenceAsync(string refNumber, CancellationToken ct = default);
}

public interface IAuthService
{
    Task<(AuthResponseDto Response, string RefreshToken)> LoginAsync(LoginDto dto, string ipAddress, CancellationToken ct = default);
    Task<(AuthResponseDto Response, string RefreshToken)> RegisterAsync(RegisterDto dto, string ipAddress, CancellationToken ct = default);
    Task<(AuthResponseDto Response, string RefreshToken)> RefreshTokenAsync(string refreshToken, string ipAddress, CancellationToken ct = default);
    Task RevokeTokenAsync(string refreshToken, string ipAddress, CancellationToken ct = default);
    Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
}

public interface IAdminService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync(CancellationToken ct = default);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default);
    Task<ProductDto> UpdateProductAsync(Guid id, CreateProductDto dto, CancellationToken ct = default);
    Task<ProductDto> ToggleProductFeaturedAsync(Guid id, bool isFeatured, CancellationToken ct = default);
    Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto, CancellationToken ct = default);
    Task<CategoryDto> UpdateCategoryAsync(Guid id, CreateCategoryDto dto, CancellationToken ct = default);
    Task<bool> DeleteCategoryAsync(Guid id, CancellationToken ct = default);
    Task<List<CategoryAttributeDto>> SaveCategoryAttributesAsync(Guid categoryId, List<CreateCategoryAttributeDto> attributes, CancellationToken ct = default);
    Task<List<RFQDto>> GetAdminRfqsAsync(CancellationToken ct = default);
    Task<RFQDto> UpdateRfqStatusAsync(Guid id, UpdateRFQStatusDto dto, CancellationToken ct = default);
    Task<RFQDto> AssignRfqAsync(Guid id, AssignRFQDto dto, CancellationToken ct = default);

    // User Management
    Task<List<UserDto>> GetUsersAsync(CancellationToken ct = default);
    Task<UserDto> CreateUserAsync(CreateUserDto dto, CancellationToken ct = default);
    Task<UserDto> UpdateUserRoleAsync(Guid id, UserRole role, CancellationToken ct = default);
    Task<UserDto> ToggleUserStatusAsync(Guid id, CancellationToken ct = default);

    // CMS & Site Settings
    Task<List<SiteSettingDto>> GetSiteSettingsAsync(CancellationToken ct = default);
    Task<List<SiteSettingDto>> UpdateSiteSettingsAsync(List<SiteSettingDto> settings, CancellationToken ct = default);

    // Bulk Import / Export
    Task<byte[]> ExportProductsCsvAsync(CancellationToken ct = default);
    Task<BulkImportResultDto> ImportProductsCsvAsync(string csvContent, CancellationToken ct = default);
}

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string HashToken(string token);
}

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

