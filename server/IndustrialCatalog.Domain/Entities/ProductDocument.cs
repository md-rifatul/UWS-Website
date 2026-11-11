using IndustrialCatalog.Domain.Common;

namespace IndustrialCatalog.Domain.Entities;

public class ProductDocument : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string DocumentUrl { get; set; } = string.Empty;
    public long? FileSizeBytes { get; set; }
    public string FileType { get; set; } = "pdf";
}

