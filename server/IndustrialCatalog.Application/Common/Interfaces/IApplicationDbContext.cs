using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Domain.Entities;

namespace IndustrialCatalog.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<CategoryAttribute> CategoryAttributes { get; }
    DbSet<Manufacturer> Manufacturers { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<ProductDocument> ProductDocuments { get; }
    DbSet<RFQ> RFQs { get; }
    DbSet<RFQItem> RFQItems { get; }
    DbSet<RFQStatusHistory> RFQStatusHistories { get; }
    DbSet<RFQNote> RFQNotes { get; }
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<SiteSetting> SiteSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

