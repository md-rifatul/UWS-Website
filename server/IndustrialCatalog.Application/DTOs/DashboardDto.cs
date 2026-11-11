namespace IndustrialCatalog.Application.DTOs;

public class DashboardSummaryDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalRfqs { get; set; }
    public int PendingRfqs { get; set; }
    public int CompletedRfqs { get; set; }
    public decimal TotalEstimatedPipelineValue { get; set; }
    public List<RFQDto> RecentRfqs { get; set; } = new();
    public List<ProductDto> TopViewedProducts { get; set; } = new();
}

