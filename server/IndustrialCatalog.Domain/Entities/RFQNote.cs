using IndustrialCatalog.Domain.Common;

namespace IndustrialCatalog.Domain.Entities;

public class RFQNote : BaseEntity
{
    public Guid RFQId { get; set; }
    public RFQ RFQ { get; set; } = null!;

    public Guid AuthorUserId { get; set; }
    public User AuthorUser { get; set; } = null!;

    public string NoteText { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = true;
}

