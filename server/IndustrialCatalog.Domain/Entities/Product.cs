using IndustrialCatalog.Domain.Common;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Domain.Entities;

public class Product : BaseEntity
{
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public Guid ManufacturerId { get; set; }
    public Manufacturer Manufacturer { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
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
    public int ViewCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Dynamic technical specifications stored in JSONB.
    /// Key: AttributeKey (string), Value: specification value (string/number/bool/array)
    /// Example: { "spindle_power": "9.0 kW", "working_area": "1300 x 2500 mm", "feed_speed": 24 }
    /// </summary>
    public string SpecificationsJson { get; set; } = "{}";

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductDocument> Documents { get; set; } = new List<ProductDocument>();
}

