using IndustrialCatalog.Domain.Common;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Domain.Entities;

public class RFQStatusHistory : BaseEntity
{
    public Guid RFQId { get; set; }
    public RFQ RFQ { get; set; } = null!;

    public RFQStatus OldStatus { get; set; }
    public RFQStatus NewStatus { get; set; }

    public Guid? ChangedByUserId { get; set; }
    public User? ChangedByUser { get; set; }

    public string? Comment { get; set; }
}

