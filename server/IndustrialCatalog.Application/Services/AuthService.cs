using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IApplicationDbContext context,
        ITokenService tokenService,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
    }

    public async Task<(AuthResponseDto Response, string RefreshToken)> LoginAsync(
        LoginDto dto,
        string ipAddress,
        CancellationToken ct = default)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.IsActive && !u.IsDeleted, ct);

        if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid corporate credentials.");
        }

        var accessToken = _tokenService.GenerateAccessToken(user);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();
        var hashedRefreshToken = _tokenService.HashToken(rawRefreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = hashedRefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress,
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync(ct);

        return (
            new AuthResponseDto
            {
                User = MapUserToDto(user),
                AccessToken = accessToken,
                ExpiresInMinutes = 15,
            },
            rawRefreshToken
        );
    }

    public async Task<(AuthResponseDto Response, string RefreshToken)> RegisterAsync(
        RegisterDto dto,
        string ipAddress,
        CancellationToken ct = default)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && !u.IsDeleted, ct);

        if (exists)
        {
            throw new InvalidOperationException("A corporate account with this email address is already registered.");
        }

        var user = new User
        {
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            FullName = dto.FullName.Trim(),
            CompanyName = dto.CompanyName?.Trim(),
            Phone = dto.Phone?.Trim(),
            Role = UserRole.CorporateBuyer,
            IsActive = true,
        };

        _context.Users.Add(user);

        var accessToken = _tokenService.GenerateAccessToken(user);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();
        var hashedRefreshToken = _tokenService.HashToken(rawRefreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = hashedRefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress,
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync(ct);

        return (
            new AuthResponseDto
            {
                User = MapUserToDto(user),
                AccessToken = accessToken,
                ExpiresInMinutes = 15,
            },
            rawRefreshToken
        );
    }

    public async Task<(AuthResponseDto Response, string RefreshToken)> RefreshTokenAsync(
        string refreshToken,
        string ipAddress,
        CancellationToken ct = default)
    {
        var hashedToken = _tokenService.HashToken(refreshToken);

        var tokenRecord = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == hashedToken, ct);

        if (tokenRecord == null || !tokenRecord.IsActive)
        {
            throw new UnauthorizedAccessException("Invalid or expired session. Please re-authenticate.");
        }

        // Revoke the old token (Token Rotation pattern)
        var newRawRefreshToken = _tokenService.GenerateRefreshToken();
        var newHashedToken = _tokenService.HashToken(newRawRefreshToken);

        tokenRecord.RevokedAtUtc = DateTime.UtcNow;
        tokenRecord.ReplacedByTokenHash = newHashedToken;

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = tokenRecord.UserId,
            TokenHash = newHashedToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress,
        };

        _context.RefreshTokens.Add(newRefreshTokenEntity);

        var newAccessToken = _tokenService.GenerateAccessToken(tokenRecord.User);
        await _context.SaveChangesAsync(ct);

        return (
            new AuthResponseDto
            {
                User = MapUserToDto(tokenRecord.User),
                AccessToken = newAccessToken,
                ExpiresInMinutes = 15,
            },
            newRawRefreshToken
        );
    }

    public async Task RevokeTokenAsync(string refreshToken, string ipAddress, CancellationToken ct = default)
    {
        var hashedToken = _tokenService.HashToken(refreshToken);
        var tokenRecord = await _context.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == hashedToken && t.RevokedAtUtc == null, ct);

        if (tokenRecord != null)
        {
            tokenRecord.RevokedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted, ct);

        return user != null ? MapUserToDto(user) : null;
    }

    private static UserDto MapUserToDto(User u)
    {
        return new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            CompanyName = u.CompanyName,
            Phone = u.Phone,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAtUtc = u.CreatedAtUtc,
        };
    }
}

