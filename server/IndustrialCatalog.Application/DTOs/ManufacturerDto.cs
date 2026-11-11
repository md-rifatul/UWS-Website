namespace IndustrialCatalog.Application.DTOs;

public class ManufacturerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
}

public class CreateManufacturerDto
{
    public string Name { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Description { get; set; }
}

