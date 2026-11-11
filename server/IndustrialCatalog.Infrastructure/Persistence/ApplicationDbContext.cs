using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Domain.Entities;

namespace IndustrialCatalog.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CategoryAttribute> CategoryAttributes => Set<CategoryAttribute>();
    public DbSet<Manufacturer> Manufacturers => Set<Manufacturer>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductDocument> ProductDocuments => Set<ProductDocument>();
    public DbSet<RFQ> RFQs => Set<RFQ>();
    public DbSet<RFQItem> RFQItems => Set<RFQItem>();
    public DbSet<RFQStatusHistory> RFQStatusHistories => Set<RFQStatusHistory>();
    public DbSet<RFQNote> RFQNotes => Set<RFQNote>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product Configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(p => p.Id);
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.HasIndex(p => p.ModelNumber);
            entity.HasIndex(p => p.SKU);
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.ManufacturerId);

            // PostgreSQL JSONB configuration
            if (Database.IsNpgsql())
            {
                entity.Property(p => p.SpecificationsJson).HasColumnType("jsonb");
            }

            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.Manufacturer)
                .WithMany(m => m.Products)
                .HasForeignKey(p => p.ManufacturerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasQueryFilter(p => !p.IsDeleted);
        });

        // Category Configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.Slug).IsUnique();

            entity.HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasQueryFilter(c => !c.IsDeleted);
        });

        // CategoryAttribute Configuration
        modelBuilder.Entity<CategoryAttribute>(entity =>
        {
            entity.ToTable("CategoryAttributes");
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => new { a.CategoryId, a.AttributeKey }).IsUnique();

            entity.HasOne(a => a.Category)
                .WithMany(c => c.Attributes)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasQueryFilter(a => !a.IsDeleted);
        });

        // Manufacturer Configuration
        modelBuilder.Entity<Manufacturer>(entity =>
        {
            entity.ToTable("Manufacturers");
            entity.HasKey(m => m.Id);
            entity.HasIndex(m => m.Slug).IsUnique();
            entity.HasQueryFilter(m => !m.IsDeleted);
        });

        // ProductImage Configuration
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.ToTable("ProductImages");
            entity.HasKey(i => i.Id);
            entity.HasQueryFilter(i => !i.IsDeleted);
        });

        // ProductDocument Configuration
        modelBuilder.Entity<ProductDocument>(entity =>
        {
            entity.ToTable("ProductDocuments");
            entity.HasKey(d => d.Id);
            entity.HasQueryFilter(d => !d.IsDeleted);
        });

        // RFQStatusHistory Configuration
        modelBuilder.Entity<RFQStatusHistory>(entity =>
        {
            entity.ToTable("RFQStatusHistories");
            entity.HasKey(h => h.Id);
            entity.HasQueryFilter(h => !h.IsDeleted);
        });

        // RFQNote Configuration
        modelBuilder.Entity<RFQNote>(entity =>
        {
            entity.ToTable("RFQNotes");
            entity.HasKey(n => n.Id);
            entity.HasQueryFilter(n => !n.IsDeleted);
        });

        // RFQ Configuration
        modelBuilder.Entity<RFQ>(entity =>
        {
            entity.ToTable("RFQs");
            entity.HasKey(r => r.Id);
            entity.HasIndex(r => r.ReferenceNumber).IsUnique();
            entity.HasIndex(r => r.Status);
            entity.HasIndex(r => r.UserId);

            entity.HasOne(r => r.User)
                .WithMany(u => u.RFQs)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(r => r.AssignedToUser)
                .WithMany()
                .HasForeignKey(r => r.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasQueryFilter(r => !r.IsDeleted);
        });

        // RFQItem Configuration
        modelBuilder.Entity<RFQItem>(entity =>
        {
            entity.ToTable("RFQItems");
            entity.HasKey(i => i.Id);

            entity.HasOne(i => i.RFQ)
                .WithMany(r => r.Items)
                .HasForeignKey(i => i.RFQId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasQueryFilter(i => !i.IsDeleted);
        });

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasQueryFilter(u => !u.IsDeleted);
        });

        // RefreshToken Configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");
            entity.HasKey(t => t.Id);
            entity.HasIndex(t => t.TokenHash).IsUnique();
            entity.HasIndex(t => t.UserId);
            entity.HasQueryFilter(t => !t.IsDeleted);

            entity.HasOne(t => t.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

