using IndustrialCatalog.Domain.Common;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Domain.Entities;

public class RFQ : BaseEntity
{
    public string ReferenceNumber { get; set; } = string.Empty;

    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? IndustryType { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; } = "Bangladesh";
    
    public RFQStatus Status { get; set; } = RFQStatus.Pending;
    public RFQPriority Priority { get; set; } = RFQPriority.Normal;

    public Guid? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }

    public DateTime? TargetDeliveryDate { get; set; }
    public decimal? EstimatedBudget { get; set; }
    public string? AdminNotes { get; set; }
    public string? ClientNotes { get; set; }

    public ICollection<RFQItem> Items { get; set; } = new List<RFQItem>();
    public ICollection<RFQStatusHistory> StatusHistory { get; set; } = new List<RFQStatusHistory>();
    public ICollection<RFQNote> InternalNotes { get; set; } = new List<RFQNote>();
}

