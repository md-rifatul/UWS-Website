using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.Services;

public class RfqService : IRfqService
{
    private readonly IApplicationDbContext _context;

    public RfqService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RFQDto> SubmitRfqAsync(SubmitRFQDto dto, Guid? userId = null, CancellationToken ct = default)
    {
        var year = DateTime.UtcNow.Year;
        var countToday = await _context.RFQs.CountAsync(ct) + 1000;
        var referenceNumber = $"RFQ-{year}-{countToday + 1}";

        var rfq = new RFQ
        {
            ReferenceNumber = referenceNumber,
            UserId = userId,
            ContactName = dto.ContactName,
            Email = dto.Email,
            Phone = dto.Phone,
            CompanyName = dto.CompanyName,
            IndustryType = dto.IndustryType,
            City = dto.City,
            Country = dto.Country,
            TargetDeliveryDate = dto.TargetDeliveryDate,
            EstimatedBudget = dto.EstimatedBudget,
            ClientNotes = dto.ClientNotes,
            Status = RFQStatus.Pending,
            Priority = RFQPriority.Normal,
            Items = dto.Items.Select(it => new RFQItem
            {
                ProductId = it.ProductId,
                Quantity = Math.Max(1, it.Quantity),
                CustomRequirements = it.CustomRequirements,
                Notes = it.Notes,
            }).ToList(),
            StatusHistory = new List<RFQStatusHistory>
            {
                new()
                {
                    OldStatus = RFQStatus.Pending,
                    NewStatus = RFQStatus.Pending,
                    Comment = "Quotation request logged via web portal.",
                }
            }
        };

        _context.RFQs.Add(rfq);
        await _context.SaveChangesAsync(ct);

        return await GetRfqByReferenceAsync(referenceNumber, ct) ?? throw new InvalidOperationException("Failed to persist RFQ");
    }

    public async Task<List<RFQDto>> GetUserRfqsAsync(Guid userId, CancellationToken ct = default)
    {
        var rfqs = await _context.RFQs
            .AsNoTracking()
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
            .Include(r => r.AssignedToUser)
            .Where(r => r.UserId == userId && !r.IsDeleted)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync(ct);

        return rfqs.Select(MapRfqToDto).ToList();
    }

    public async Task<RFQDto?> GetRfqByReferenceAsync(string refNumber, CancellationToken ct = default)
    {
        var rfq = await _context.RFQs
            .AsNoTracking()
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Category)
            .Include(r => r.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Manufacturer)
            .Include(r => r.AssignedToUser)
            .FirstOrDefaultAsync(r => r.ReferenceNumber == refNumber && !r.IsDeleted, ct);

        return rfq != null ? MapRfqToDto(rfq) : null;
    }

    public static RFQDto MapRfqToDto(RFQ r)
    {
        return new RFQDto
        {
            Id = r.Id,
            ReferenceNumber = r.ReferenceNumber,
            UserId = r.UserId,
            ContactName = r.ContactName,
            Email = r.Email,
            Phone = r.Phone,
            CompanyName = r.CompanyName,
            IndustryType = r.IndustryType,
            City = r.City,
            Country = r.Country,
            Status = r.Status,
            Priority = r.Priority,
            AssignedToUserId = r.AssignedToUserId,
            AssignedToUserName = r.AssignedToUser?.FullName,
            TargetDeliveryDate = r.TargetDeliveryDate,
            EstimatedBudget = r.EstimatedBudget,
            AdminNotes = r.AdminNotes,
            ClientNotes = r.ClientNotes,
            CreatedAtUtc = r.CreatedAtUtc,
            Items = r.Items?.Select(it => new RFQItemDto
            {
                Id = it.Id,
                ProductId = it.ProductId,
                Quantity = it.Quantity,
                CustomRequirements = it.CustomRequirements,
                Notes = it.Notes,
                Product = it.Product != null ? CatalogService.MapProductToDto(it.Product) : null,
            }).ToList() ?? new(),
        };
    }
}

