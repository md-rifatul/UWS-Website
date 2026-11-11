using IndustrialCatalog.Domain.Common;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Domain.Entities;

public class CategoryAttribute : BaseEntity
{
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string AttributeKey { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public AttributeDataType DataType { get; set; } = AttributeDataType.Text;
    public string? Unit { get; set; }
    public string? OptionsJson { get; set; }
    public bool IsFilterable { get; set; } = true;
    public bool IsRequired { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
}

