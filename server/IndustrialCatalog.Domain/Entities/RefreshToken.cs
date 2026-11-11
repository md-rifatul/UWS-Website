using IndustrialCatalog.Domain.Common;

namespace IndustrialCatalog.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime? RevokedAtUtc { get; set; }
    public string? ReplacedByTokenHash { get; set; }
    public string? CreatedByIp { get; set; }

    public bool IsActive => RevokedAtUtc == null && !IsExpired;
    public bool IsExpired => DateTime.UtcNow >= ExpiresAtUtc;
}

