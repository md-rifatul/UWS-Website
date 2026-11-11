using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Entities;

namespace IndustrialCatalog.Application.Services;

public class CatalogService : ICatalogService
{
    private readonly IApplicationDbContext _context;

    public CatalogService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive && !c.IsDeleted)
            .OrderBy(c => c.DisplayOrder)
            .Include(c => c.Attributes.Where(a => !a.IsDeleted).OrderBy(a => a.DisplayOrder))
            .Include(c => c.Products.Where(p => p.IsActive && !p.IsDeleted))
            .ToListAsync(ct);

        return categories.Select(MapCategoryToDto).ToList();
    }

    public async Task<CategoryDto?> GetCategoryBySlugAsync(string slug, CancellationToken ct = default)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .Include(c => c.Attributes.Where(a => !a.IsDeleted).OrderBy(a => a.DisplayOrder))
            .Include(c => c.Products.Where(p => p.IsActive && !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive && !c.IsDeleted, ct);

        return category != null ? MapCategoryToDto(category) : null;
    }

    public async Task<List<ManufacturerDto>> GetManufacturersAsync(CancellationToken ct = default)
    {
        var manufacturers = await _context.Manufacturers
            .AsNoTracking()
            .Where(m => m.IsActive && !m.IsDeleted)
            .Include(m => m.Products.Where(p => p.IsActive && !p.IsDeleted))
            .ToListAsync(ct);

        return manufacturers.Select(m => new ManufacturerDto
        {
            Id = m.Id,
            Name = m.Name,
            Slug = m.Slug,
            Country = m.Country,
            LogoUrl = m.LogoUrl,
            WebsiteUrl = m.WebsiteUrl,
            Description = m.Description,
            IsActive = m.IsActive,
            ProductCount = m.Products.Count,
        }).ToList();
    }

    public async Task<PaginatedList<ProductDto>> GetProductsAsync(ProductFilterParamsDto filter, CancellationToken ct = default)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Include(p => p.Documents)
            .Where(p => p.IsActive && !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                p.ModelNumber.ToLower().Contains(search) ||
                p.SKU.ToLower().Contains(search) ||
                p.ShortDescription.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filter.CategorySlug))
        {
            query = query.Where(p => p.Category.Slug == filter.CategorySlug);
        }

        if (!string.IsNullOrWhiteSpace(filter.ManufacturerSlug))
        {
            query = query.Where(p => p.Manufacturer.Slug == filter.ManufacturerSlug);
        }

        if (filter.Condition.HasValue)
        {
            query = query.Where(p => p.Condition == filter.Condition.Value);
        }

        if (filter.Availability.HasValue)
        {
            query = query.Where(p => p.AvailabilityStatus == filter.Availability.Value);
        }

        if (filter.IsFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);
        }

        // Sorting
        query = filter.SortBy switch
        {
            "name_asc" => query.OrderBy(p => p.Name),
            "name_desc" => query.OrderByDescending(p => p.Name),
            "views" => query.OrderByDescending(p => p.ViewCount),
            _ => query.OrderByDescending(p => p.CreatedAtUtc)
        };

        var totalCount = await query.CountAsync(ct);
        var pageNumber = Math.Max(1, filter.PageNumber);
        var pageSize = Math.Max(1, Math.Min(50, filter.PageSize));

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = items.Select(MapProductToDto).ToList();
        return new PaginatedList<ProductDto>(dtos, totalCount, pageNumber, pageSize);
    }

    public async Task<ProductDto?> GetProductBySlugAsync(string slug, CancellationToken ct = default)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive && !p.IsDeleted, ct);

        if (product == null) return null;

        // Increment view count asynchronously
        product.ViewCount++;
        await _context.SaveChangesAsync(ct);

        return MapProductToDto(product);
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive && !p.IsDeleted, ct);

        return product != null ? MapProductToDto(product) : null;
    }

    private static CategoryDto MapCategoryToDto(Category c)
    {
        return new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            IconName = c.IconName,
            ParentCategoryId = c.ParentCategoryId,
            DisplayOrder = c.DisplayOrder,
            IsActive = c.IsActive,
            ProductCount = c.Products?.Count ?? 0,
            Attributes = c.Attributes?.Select(a => new CategoryAttributeDto
            {
                Id = a.Id,
                CategoryId = a.CategoryId,
                AttributeKey = a.AttributeKey,
                Label = a.Label,
                DataType = a.DataType,
                Unit = a.Unit,
                OptionsJson = a.OptionsJson,
                Options = !string.IsNullOrEmpty(a.OptionsJson)
                    ? JsonSerializer.Deserialize<List<string>>(a.OptionsJson)
                    : null,
                IsFilterable = a.IsFilterable,
                IsRequired = a.IsRequired,
                DisplayOrder = a.DisplayOrder,
            }).ToList() ?? new(),
        };
    }

    public static ProductDto MapProductToDto(Product p)
    {
        Dictionary<string, object> specs = new();
        if (!string.IsNullOrWhiteSpace(p.SpecificationsJson))
        {
            try
            {
                specs = JsonSerializer.Deserialize<Dictionary<string, object>>(p.SpecificationsJson) ?? new();
            }
            catch
            {
                specs = new();
            }
        }

        return new ProductDto
        {
            Id = p.Id,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? string.Empty,
            CategorySlug = p.Category?.Slug ?? string.Empty,
            ManufacturerId = p.ManufacturerId,
            ManufacturerName = p.Manufacturer?.Name ?? string.Empty,
            Name = p.Name,
            Slug = p.Slug,
            ModelNumber = p.ModelNumber,
            SKU = p.SKU,
            ShortDescription = p.ShortDescription,
            FullDescription = p.FullDescription,
            MainImageUrl = p.MainImageUrl,
            Condition = p.Condition,
            AvailabilityStatus = p.AvailabilityStatus,
            ReferencePrice = p.ReferencePrice,
            ShowPrice = p.ShowPrice,
            IsFeatured = p.IsFeatured,
            ViewCount = p.ViewCount,
            IsActive = p.IsActive,
            Specifications = specs,
            Images = p.Images?.Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                ThumbnailUrl = i.ThumbnailUrl,
                AltText = i.AltText,
                DisplayOrder = i.DisplayOrder,
                IsPrimary = i.IsPrimary,
            }).ToList() ?? new(),
            Documents = p.Documents?.Select(d => new ProductDocumentDto
            {
                Id = d.Id,
                Title = d.Title,
                DocumentUrl = d.DocumentUrl,
                FileSizeBytes = d.FileSizeBytes,
                FileType = d.FileType,
            }).ToList() ?? new(),
            CreatedAtUtc = p.CreatedAtUtc,
        };
    }

    public async Task<List<SiteSettingDto>> GetPublicSiteSettingsAsync(CancellationToken ct = default)
    {
        var settings = await _context.SiteSettings
            .AsNoTracking()
            .Where(s => !s.IsDeleted)
            .ToListAsync(ct);

        if (settings.Count == 0)
        {
            var defaults = new List<SiteSetting>
            {
                new() { Key = "logo_short", Value = "WTS", Group = "Brand", Description = "Brand Short Code" },
                new() { Key = "logo_title", Value = "WOODTECH", Group = "Brand", Description = "Primary Brand Title" },
                new() { Key = "logo_badge", Value = "Solutions", Group = "Brand", Description = "Brand Subtitle Badge" },
                new() { Key = "logo_url", Value = "", Group = "Brand", Description = "Custom Image Logo URL (optional)" },
                new() { Key = "showroom_name", Value = "Central Technology Center", Group = "Location", Description = "Primary Showroom & Demo Center Name" },
                new() { Key = "showroom_badge", Value = "40,000 sq ft Demo", Group = "Location", Description = "Showroom demo space badge" },
                new() { Key = "showroom_address", Value = "Plot 42, Tejgaon Industrial Area, Dhaka-1208, Bangladesh", Group = "Location", Description = "Showroom physical address" },
                new() { Key = "showroom_hours", Value = "Sat – Thu: 9:00 AM – 7:00 PM", Group = "Location", Description = "Showroom operating hours" },
                new() { Key = "showroom_phone", Value = "+880 1700-000000 / +880 2-9880000", Group = "Location", Description = "Showroom phone number" },
                new() { Key = "showroom_maps_url", Value = "https://maps.google.com/?q=Tejgaon+Industrial+Area+Dhaka", Group = "Location", Description = "Showroom Google Maps link" },
                new() { Key = "office_name", Value = "Corporate Head Office", Group = "Location", Description = "Corporate Office Name" },
                new() { Key = "office_address", Value = "House #14, Road #18, Sector #07, Uttara Model Town, Dhaka-1230, Bangladesh", Group = "Location", Description = "Corporate Office address" },
                new() { Key = "support_phone", Value = "+880 1700-000000", Group = "Contact", Description = "TopBar support phone" },
                new() { Key = "support_email", Value = "info@woodtechsolutionbd.com", Group = "Contact", Description = "TopBar support email" },
                new() { Key = "whatsapp_number", Value = "+880 1700-000000", Group = "Contact", Description = "WhatsApp Desk number" },
                new() { Key = "partner_badge", Value = "Authorized Industrial Technology Partner", Group = "Contact", Description = "TopBar partner badge" },
                new() { Key = "hero_headline", Value = "High-Precision CNC & Industrial Woodworking Machinery", Group = "Homepage", Description = "Hero banner main title" },
                new() { Key = "hero_subtitle", Value = "Turnkey industrial solutions with complete factory planning, automated production line layout, machinery commissioning, and genuine spare parts support.", Group = "Homepage", Description = "Hero banner subtitle" },
            };
            _context.SiteSettings.AddRange(defaults);
            await _context.SaveChangesAsync(ct);
            settings = defaults;
        }

        return settings.Select(s => new SiteSettingDto
        {
            Key = s.Key,
            Value = s.Value,
            Description = s.Description,
            Group = s.Group,
        }).ToList();
    }
}

