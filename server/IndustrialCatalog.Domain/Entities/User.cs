using IndustrialCatalog.Domain.Common;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.CorporateBuyer;
    public bool IsActive { get; set; } = true;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
}

