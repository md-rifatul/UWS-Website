using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;

namespace IndustrialCatalog.API.Controllers;

/// <summary>
/// Corporate authentication, JWT tokens, and HTTP-only refresh token session cookies.
/// </summary>
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;
    private const string RefreshTokenCookieName = "woodtech_refresh_token";

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticates a corporate user and issues a stateless JWT access token along with an HTTP-only refresh token cookie.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        var ip = GetClientIp();
        var (response, refreshToken) = await _authService.LoginAsync(dto, ip, ct);
        SetRefreshTokenCookie(refreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Registers a new corporate buyer account.
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto, CancellationToken ct)
    {
        var ip = GetClientIp();
        var (response, refreshToken) = await _authService.RegisterAsync(dto, ip, ct);
        SetRefreshTokenCookie(refreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Silently refreshes an expired access token using the HTTP-only refresh cookie with token rotation.
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh(CancellationToken ct)
    {
        var token = Request.Cookies[RefreshTokenCookieName];
        if (string.IsNullOrWhiteSpace(token))
        {
            return Unauthorized(new { message = "No refresh token cookie present." });
        }

        var ip = GetClientIp();
        try
        {
            var (response, newRefreshToken) = await _authService.RefreshTokenAsync(token, ip, ct);
            SetRefreshTokenCookie(newRefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            Response.Cookies.Delete(RefreshTokenCookieName);
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Revokes active refresh token and clears session cookie.
    /// </summary>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var token = Request.Cookies[RefreshTokenCookieName];
        if (!string.IsNullOrWhiteSpace(token))
        {
            var ip = GetClientIp();
            await _authService.RevokeTokenAsync(token, ip, ct);
        }

        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/api/v1/auth",
        });

        return NoContent();
    }

    /// <summary>
    /// Returns the authenticated user's profile and assigned role.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMe(CancellationToken ct)
    {
        var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(subClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _authService.GetCurrentUserAsync(userId, ct);
        if (user == null) return NotFound();
        return Ok(user);
    }

    private void SetRefreshTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/api/v1/auth",
        };

        Response.Cookies.Append(RefreshTokenCookieName, token, cookieOptions);
    }

    private string GetClientIp()
    {
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwarded))
        {
            var ip = forwarded.FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
            if (!string.IsNullOrWhiteSpace(ip)) return ip;
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
    }
}
