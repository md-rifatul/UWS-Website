using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.DTOs;

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.CorporateBuyer;
}

public class UpdateUserRoleDto
{
    public UserRole Role { get; set; }
}

public class SiteSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Group { get; set; } = "General";
}

public class BulkImportResultDto
{
    public int TotalProcessed { get; set; }
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public List<string> Errors { get; set; } = new();
}

