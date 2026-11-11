using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.DTOs;

public class RFQDto
{
    public Guid Id { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? IndustryType { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public RFQStatus Status { get; set; }
    public RFQPriority Priority { get; set; }
    public Guid? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    public DateTime? TargetDeliveryDate { get; set; }
    public decimal? EstimatedBudget { get; set; }
    public string? AdminNotes { get; set; }
    public string? ClientNotes { get; set; }
    public List<RFQItemDto> Items { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; }
}

public class RFQItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public ProductDto? Product { get; set; }
    public int Quantity { get; set; }
    public string? CustomRequirements { get; set; }
    public string? Notes { get; set; }
}

public class SubmitRFQDto
{
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? IndustryType { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; } = "Bangladesh";
    public DateTime? TargetDeliveryDate { get; set; }
    public decimal? EstimatedBudget { get; set; }
    public string? ClientNotes { get; set; }
    public List<SubmitRFQItemDto> Items { get; set; } = new();
}

public class SubmitRFQItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;
    public string? CustomRequirements { get; set; }
    public string? Notes { get; set; }
}

public class UpdateRFQStatusDto
{
    public RFQStatus Status { get; set; }
    public string? InternalNote { get; set; }
}

public class AssignRFQDto
{
    public Guid? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
}

