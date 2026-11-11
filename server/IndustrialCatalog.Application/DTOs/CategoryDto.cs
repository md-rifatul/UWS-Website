using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconName { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
    public List<CategoryAttributeDto> Attributes { get; set; } = new();
}

public class CategoryAttributeDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string AttributeKey { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public AttributeDataType DataType { get; set; }
    public string? Unit { get; set; }
    public string? OptionsJson { get; set; }
    public List<string>? Options { get; set; }
    public bool IsFilterable { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconName { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

public class CreateCategoryAttributeDto
{
    public string AttributeKey { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public AttributeDataType DataType { get; set; }
    public string? Unit { get; set; }
    public List<string>? Options { get; set; }
    public bool IsFilterable { get; set; } = true;
    public bool IsRequired { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
}

