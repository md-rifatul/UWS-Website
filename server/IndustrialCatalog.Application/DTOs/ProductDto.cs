using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public Guid ManufacturerId { get; set; }
    public string ManufacturerName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
    public MachineCondition Condition { get; set; }
    public AvailabilityStatus AvailabilityStatus { get; set; }
    public decimal? ReferencePrice { get; set; }
    public bool ShowPrice { get; set; }
    public bool IsFeatured { get; set; }
    public int ViewCount { get; set; }
    public bool IsActive { get; set; }
    public Dictionary<string, object> Specifications { get; set; } = new();
    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductDocumentDto> Documents { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; }
}

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
}

public class ProductDocumentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string DocumentUrl { get; set; } = string.Empty;
    public long? FileSizeBytes { get; set; }
    public string FileType { get; set; } = "pdf";
}

public class CreateProductDto
{
    public Guid CategoryId { get; set; }
    public Guid ManufacturerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
    public MachineCondition Condition { get; set; } = MachineCondition.BrandNew;
    public AvailabilityStatus AvailabilityStatus { get; set; } = AvailabilityStatus.InStock;
    public decimal? ReferencePrice { get; set; }
    public bool ShowPrice { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public Dictionary<string, object>? Specifications { get; set; }
}

public class ProductFilterParamsDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 9;
    public string? Search { get; set; }
    public string? CategorySlug { get; set; }
    public string? ManufacturerSlug { get; set; }
    public MachineCondition? Condition { get; set; }
    public AvailabilityStatus? Availability { get; set; }
    public bool? IsFeatured { get; set; }
    public string? SortBy { get; set; } // newest, views, name_asc, name_desc
}

public class PaginatedList<T>
{
    public List<T> Items { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    public PaginatedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        Items = items;
        TotalCount = count;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }
}

