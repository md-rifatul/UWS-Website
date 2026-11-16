using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.Services;

public class AdminService : IAdminService
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public AdminService(IApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(CancellationToken ct = default)
    {
        var totalProducts = await _context.Products.CountAsync(p => p.IsActive && !p.IsDeleted, ct);
        var totalCategories = await _context.Categories.CountAsync(c => c.IsActive && !c.IsDeleted, ct);
        var totalRfqs = await _context.RFQs.CountAsync(r => !r.IsDeleted, ct);
        var pendingRfqs = await _context.RFQs.CountAsync(r => (r.Status == RFQStatus.Pending || r.Status == RFQStatus.UnderReview) && !r.IsDeleted, ct);
        var completedRfqs = await _context.RFQs.CountAsync(r => (r.Status == RFQStatus.Completed || r.Status == RFQStatus.Approved) && !r.IsDeleted, ct);

        var pipelineValue = await _context.RFQs
            .Where(r => !r.IsDeleted && r.EstimatedBudget.HasValue)
            .SumAsync(r => r.EstimatedBudget!.Value, ct);

        var recentRfqs = await _context.RFQs
            .AsNoTracking()
            .Include(r => r.Items)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Take(5)
            .ToListAsync(ct);

        var topViewed = await _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive && !p.IsDeleted)
            .OrderByDescending(p => p.ViewCount)
            .Take(5)
            .ToListAsync(ct);

        return new DashboardSummaryDto
        {
            TotalProducts = totalProducts,
            TotalCategories = totalCategories,
            TotalRfqs = totalRfqs,
            PendingRfqs = pendingRfqs,
            CompletedRfqs = completedRfqs,
            TotalEstimatedPipelineValue = pipelineValue,
            RecentRfqs = recentRfqs.Select(RfqService.MapRfqToDto).ToList(),
            TopViewedProducts = topViewed.Select(CatalogService.MapProductToDto).ToList(),
        };
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        var slug = GenerateSlug(dto.Name);
        var specsJson = dto.Specifications != null
            ? JsonSerializer.Serialize(dto.Specifications)
            : "{}";

        var product = new Product
        {
            CategoryId = dto.CategoryId,
            ManufacturerId = dto.ManufacturerId,
            Name = dto.Name,
            Slug = slug,
            ModelNumber = dto.ModelNumber,
            SKU = dto.SKU,
            ShortDescription = dto.ShortDescription,
            FullDescription = dto.FullDescription,
            MainImageUrl = dto.MainImageUrl,
            Condition = dto.Condition,
            AvailabilityStatus = dto.AvailabilityStatus,
            ReferencePrice = dto.ReferencePrice,
            ShowPrice = dto.ShowPrice,
            IsFeatured = dto.IsFeatured,
            SpecificationsJson = specsJson,
            IsActive = true,
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(ct);

        return (await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .FirstOrDefaultAsync(p => p.Id == product.Id, ct))
            is Product p ? CatalogService.MapProductToDto(p) : throw new InvalidOperationException();
    }

    public async Task<ProductDto> UpdateProductAsync(Guid id, CreateProductDto dto, CancellationToken ct = default)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product == null) throw new KeyNotFoundException("Product not found.");

        if (dto.CategoryId != Guid.Empty) product.CategoryId = dto.CategoryId;
        if (dto.ManufacturerId != Guid.Empty) product.ManufacturerId = dto.ManufacturerId;
        if (!string.IsNullOrWhiteSpace(dto.Name)) product.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.ModelNumber)) product.ModelNumber = dto.ModelNumber;
        if (!string.IsNullOrWhiteSpace(dto.SKU)) product.SKU = dto.SKU;
        if (!string.IsNullOrWhiteSpace(dto.ShortDescription)) product.ShortDescription = dto.ShortDescription;
        if (!string.IsNullOrWhiteSpace(dto.FullDescription)) product.FullDescription = dto.FullDescription;
        if (!string.IsNullOrWhiteSpace(dto.MainImageUrl)) product.MainImageUrl = dto.MainImageUrl;
        product.Condition = dto.Condition;
        product.AvailabilityStatus = dto.AvailabilityStatus;
        if (dto.ReferencePrice.HasValue) product.ReferencePrice = dto.ReferencePrice;
        product.ShowPrice = dto.ShowPrice;
        product.IsFeatured = dto.IsFeatured;
        product.UpdatedAtUtc = DateTime.UtcNow;

        if (dto.Specifications != null && dto.Specifications.Count > 0)
        {
            product.SpecificationsJson = JsonSerializer.Serialize(dto.Specifications);
        }

        await _context.SaveChangesAsync(ct);
        return CatalogService.MapProductToDto(product);
    }

    public async Task<ProductDto> ToggleProductFeaturedAsync(Guid id, bool isFeatured, CancellationToken ct = default)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product == null) throw new KeyNotFoundException("Product not found.");

        product.IsFeatured = isFeatured;
        product.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return CatalogService.MapProductToDto(product);
    }

    public async Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (product == null) return false;

        product.IsDeleted = true;
        product.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto, CancellationToken ct = default)
    {
        var category = new Category
        {
            Name = dto.Name,
            Slug = GenerateSlug(dto.Name),
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            IconName = dto.IconName,
            ParentCategoryId = dto.ParentCategoryId,
            DisplayOrder = dto.DisplayOrder,
            IsActive = true,
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(ct);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            IconName = category.IconName,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
        };
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid id, CreateCategoryDto dto, CancellationToken ct = default)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new KeyNotFoundException($"Category {id} not found");

        category.Name = dto.Name;
        category.Slug = GenerateSlug(dto.Name);
        category.Description = dto.Description;
        category.ImageUrl = dto.ImageUrl;
        category.IconName = dto.IconName;
        category.ParentCategoryId = dto.ParentCategoryId;
        category.DisplayOrder = dto.DisplayOrder;
        category.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            IconName = category.IconName,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
        };
    }

    public async Task<bool> DeleteCategoryAsync(Guid id, CancellationToken ct = default)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (category == null) return false;

        category.IsDeleted = true;
        category.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<CategoryAttributeDto>> SaveCategoryAttributesAsync(
        Guid categoryId,
        List<CreateCategoryAttributeDto> attributes,
        CancellationToken ct = default)
    {
        var existing = await _context.CategoryAttributes
            .Where(a => a.CategoryId == categoryId)
            .ToListAsync(ct);

        _context.CategoryAttributes.RemoveRange(existing);

        var newEntities = attributes.Select(a => new CategoryAttribute
        {
            CategoryId = categoryId,
            AttributeKey = a.AttributeKey,
            Label = a.Label,
            DataType = a.DataType,
            Unit = a.Unit,
            OptionsJson = a.Options != null ? JsonSerializer.Serialize(a.Options) : null,
            IsFilterable = a.IsFilterable,
            IsRequired = a.IsRequired,
            DisplayOrder = a.DisplayOrder,
        }).ToList();

        _context.CategoryAttributes.AddRange(newEntities);
        await _context.SaveChangesAsync(ct);

        return newEntities.Select(a => new CategoryAttributeDto
        {
            Id = a.Id,
            CategoryId = a.CategoryId,
            AttributeKey = a.AttributeKey,
            Label = a.Label,
            DataType = a.DataType,
            Unit = a.Unit,
            OptionsJson = a.OptionsJson,
            Options = a.OptionsJson != null ? JsonSerializer.Deserialize<List<string>>(a.OptionsJson) : null,
            IsFilterable = a.IsFilterable,
            IsRequired = a.IsRequired,
            DisplayOrder = a.DisplayOrder,
        }).ToList();
    }

    public async Task<List<RFQDto>> GetAdminRfqsAsync(CancellationToken ct = default)
    {
        var rfqs = await _context.RFQs
            .AsNoTracking()
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
            .Include(r => r.AssignedToUser)
            .Where(r => !r.IsDeleted)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync(ct);

        return rfqs.Select(RfqService.MapRfqToDto).ToList();
    }

    public async Task<RFQDto> UpdateRfqStatusAsync(Guid id, UpdateRFQStatusDto dto, CancellationToken ct = default)
    {
        var rfq = await _context.RFQs
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
            .Include(r => r.AssignedToUser)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);

        if (rfq == null) throw new KeyNotFoundException("RFQ not found.");

        var oldStatus = rfq.Status;
        rfq.Status = dto.Status;
        rfq.UpdatedAtUtc = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(dto.InternalNote))
        {
            rfq.AdminNotes = (rfq.AdminNotes != null ? rfq.AdminNotes + "\n" : "") +
                $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm}] {dto.InternalNote.Trim()}";
        }

        rfq.StatusHistory.Add(new RFQStatusHistory
        {
            OldStatus = oldStatus,
            NewStatus = dto.Status,
            Comment = dto.InternalNote,
        });

        await _context.SaveChangesAsync(ct);
        return RfqService.MapRfqToDto(rfq);
    }

    public async Task<RFQDto> AssignRfqAsync(Guid id, AssignRFQDto dto, CancellationToken ct = default)
    {
        var rfq = await _context.RFQs
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
            .Include(r => r.AssignedToUser)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);

        if (rfq == null) throw new KeyNotFoundException("RFQ not found.");

        if (dto.AssignedToUserId.HasValue)
        {
            rfq.AssignedToUserId = dto.AssignedToUserId.Value;
        }
        rfq.Status = RFQStatus.Assigned;
        rfq.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return RfqService.MapRfqToDto(rfq);
    }

    // --- User Management ---

    public async Task<List<UserDto>> GetUsersAsync(CancellationToken ct = default)
    {
        var users = await _context.Users
            .AsNoTracking()
            .Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAtUtc)
            .ToListAsync(ct);

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            CompanyName = u.CompanyName,
            Phone = u.Phone,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAtUtc = u.CreatedAtUtc,
        }).ToList();
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto, CancellationToken ct = default)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && !u.IsDeleted, ct);
        if (exists) throw new InvalidOperationException("User email already exists.");

        var user = new User
        {
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            FullName = dto.FullName.Trim(),
            CompanyName = dto.CompanyName?.Trim(),
            Phone = dto.Phone?.Trim(),
            Role = dto.Role,
            IsActive = true,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(ct);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            CompanyName = user.CompanyName,
            Phone = user.Phone,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
        };
    }

    public async Task<UserDto> UpdateUserRoleAsync(Guid id, UserRole role, CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted, ct);
        if (user == null) throw new KeyNotFoundException("User not found.");

        user.Role = role;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            CompanyName = user.CompanyName,
            Phone = user.Phone,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
        };
    }

    public async Task<UserDto> ToggleUserStatusAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted, ct);
        if (user == null) throw new KeyNotFoundException("User not found.");

        user.IsActive = !user.IsActive;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            CompanyName = user.CompanyName,
            Phone = user.Phone,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
        };
    }

    // --- CMS & Site Settings ---

    public async Task<List<SiteSettingDto>> GetSiteSettingsAsync(CancellationToken ct = default)
    {
        var settings = await _context.SiteSettings
            .AsNoTracking()
            .Where(s => !s.IsDeleted)
            .ToListAsync(ct);

        if (settings.Count == 0)
        {
            // Seed defaults
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

    public async Task<List<SiteSettingDto>> UpdateSiteSettingsAsync(List<SiteSettingDto> settings, CancellationToken ct = default)
    {
        foreach (var item in settings)
        {
            var existing = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Key == item.Key && !s.IsDeleted, ct);
            if (existing != null)
            {
                existing.Value = item.Value;
                existing.Group = item.Group;
                existing.UpdatedAtUtc = DateTime.UtcNow;
            }
            else
            {
                _context.SiteSettings.Add(new SiteSetting
                {
                    Key = item.Key,
                    Value = item.Value,
                    Group = item.Group,
                });
            }
        }
        await _context.SaveChangesAsync(ct);
        return settings;
    }

    // --- Bulk Import / Export ---

    public async Task<byte[]> ExportProductsCsvAsync(CancellationToken ct = default)
    {
        var products = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .Where(p => p.IsActive && !p.IsDeleted)
            .OrderBy(p => p.Name)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("Name,ModelNumber,SKU,Category,Manufacturer,Condition,Availability,ReferencePrice,ShortDescription,SpecificationsJson");

        foreach (var p in products)
        {
            var name = EscapeCsv(p.Name);
            var model = EscapeCsv(p.ModelNumber);
            var sku = EscapeCsv(p.SKU);
            var cat = EscapeCsv(p.Category?.Name ?? "");
            var man = EscapeCsv(p.Manufacturer?.Name ?? "");
            var cond = p.Condition.ToString();
            var avail = p.AvailabilityStatus.ToString();
            var price = p.ReferencePrice?.ToString() ?? "";
            var desc = EscapeCsv(p.ShortDescription);
            var specs = EscapeCsv(p.SpecificationsJson);

            sb.AppendLine($"{name},{model},{sku},{cat},{man},{cond},{avail},{price},{desc},{specs}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public async Task<BulkImportResultDto> ImportProductsCsvAsync(string csvContent, CancellationToken ct = default)
    {
        var result = new BulkImportResultDto();
        var lines = csvContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length <= 1)
        {
            result.Errors.Add("CSV file contains no data rows.");
            return result;
        }

        var categories = await _context.Categories.Where(c => !c.IsDeleted).ToListAsync(ct);
        var manufacturers = await _context.Manufacturers.Where(m => !m.IsDeleted).ToListAsync(ct);

        for (int i = 1; i < lines.Length; i++)
        {
            result.TotalProcessed++;
            var line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            try
            {
                var parts = ParseCsvLine(line);
                if (parts.Count < 5)
                {
                    result.FailureCount++;
                    result.Errors.Add($"Row {i}: Incomplete columns.");
                    continue;
                }

                var name = parts[0].Trim();
                var model = parts[1].Trim();
                var sku = parts[2].Trim();
                var catName = parts[3].Trim();
                var manName = parts[4].Trim();

                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(model))
                {
                    result.FailureCount++;
                    result.Errors.Add($"Row {i}: Name and ModelNumber are required.");
                    continue;
                }

                var cat = categories.FirstOrDefault(c => c.Name.Equals(catName, StringComparison.OrdinalIgnoreCase))
                    ?? categories.FirstOrDefault();
                var man = manufacturers.FirstOrDefault(m => m.Name.Equals(manName, StringComparison.OrdinalIgnoreCase))
                    ?? manufacturers.FirstOrDefault();

                if (cat == null || man == null)
                {
                    result.FailureCount++;
                    result.Errors.Add($"Row {i}: Missing valid category or manufacturer.");
                    continue;
                }

                var product = new Product
                {
                    Name = name,
                    Slug = GenerateSlug(name),
                    ModelNumber = model,
                    SKU = !string.IsNullOrEmpty(sku) ? sku : $"SKU-{DateTime.UtcNow.Ticks % 100000}",
                    CategoryId = cat.Id,
                    ManufacturerId = man.Id,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    MainImageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                    ShortDescription = parts.Count > 8 ? parts[8] : "Imported machinery unit.",
                    FullDescription = "Imported through automated batch pipeline.",
                    SpecificationsJson = parts.Count > 9 ? parts[9] : "{}",
                    IsActive = true,
                };

                _context.Products.Add(product);
                result.SuccessCount++;
            }
            catch (Exception ex)
            {
                result.FailureCount++;
                result.Errors.Add($"Row {i}: {ex.Message}");
            }
        }

        await _context.SaveChangesAsync(ct);
        return result;
    }

    private static string EscapeCsv(string field)
    {
        if (string.IsNullOrEmpty(field)) return "";
        if (field.Contains(",") || field.Contains("\"") || field.Contains("\n") || field.Contains("\r"))
        {
            return $"\"{field.Replace("\"", "\"\"")}\"";
        }
        return field;
    }

    private static List<string> ParseCsvLine(string line)
    {
        var result = new List<string>();
        var sb = new StringBuilder();
        bool inQuotes = false;

        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];
            if (c == '\"')
            {
                if (inQuotes && i + 1 < line.Length && line[i + 1] == '\"')
                {
                    sb.Append('\"');
                    i++;
                }
                else
                {
                    inQuotes = !inQuotes;
                }
            }
            else if (c == ',' && !inQuotes)
            {
                result.Add(sb.ToString());
                sb.Clear();
            }
            else
            {
                sb.Append(c);
            }
        }
        result.Add(sb.ToString());
        return result;
    }

    private static string GenerateSlug(string text)
    {
        var cleaned = text.ToLower().Trim();
        var chars = cleaned.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
        return new string(chars).Trim('-');
    }
}
