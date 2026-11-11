using IndustrialCatalog.Domain.Common;

namespace IndustrialCatalog.Domain.Entities;

public class RFQItem : BaseEntity
{
    public Guid RFQId { get; set; }
    public RFQ RFQ { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; } = 1;
    public string? CustomRequirements { get; set; }
    public string? SelectedConfigurationsJson { get; set; }
    public string? Notes { get; set; }
}

