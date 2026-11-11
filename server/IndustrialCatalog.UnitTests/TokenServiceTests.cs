using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;
using IndustrialCatalog.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace IndustrialCatalog.UnitTests;

public class TokenServiceTests
{
    private readonly TokenService _tokenService;

    public TokenServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Jwt:SecretKey", "SUPER_SECURE_TEST_SECRET_KEY_FOR_INDUSTRIAL_CATALOG_PLATFORM_WOODTECH_2026!" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:ExpiryMinutes", "30" }
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _tokenService = new TokenService(configuration);
    }

    [Fact]
    public void GenerateAccessToken_ReturnsValidJwt_WithExpectedClaims()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "lead.engineer@woodtech.com",
            FullName = "Engr. Rahman",
            CompanyName = "WoodTech Solutions",
            Role = UserRole.Admin,
            IsActive = true
        };

        // Act
        var tokenString = _tokenService.GenerateAccessToken(user);

        // Assert
        Assert.NotNull(tokenString);
        Assert.NotEmpty(tokenString);

        var handler = new JwtSecurityTokenHandler();
        Assert.True(handler.CanReadToken(tokenString));

        var jwtToken = handler.ReadJwtToken(tokenString);
        Assert.Equal("TestIssuer", jwtToken.Issuer);
        Assert.Contains("TestAudience", jwtToken.Audiences);

        var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email");
        Assert.NotNull(emailClaim);
        Assert.Equal(user.Email, emailClaim.Value);

        var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "role");
        Assert.NotNull(roleClaim);
        Assert.Equal("Admin", roleClaim.Value);
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsBase64CryptoString()
    {
        // Act
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Assert
        Assert.NotNull(refreshToken);
        Assert.NotEmpty(refreshToken);

        // Should be valid base64
        var bytes = Convert.FromBase64String(refreshToken);
        Assert.Equal(64, bytes.Length);
    }

    [Fact]
    public void GenerateRefreshToken_GeneratesUniqueTokensEachCall()
    {
        // Act
        var token1 = _tokenService.GenerateRefreshToken();
        var token2 = _tokenService.GenerateRefreshToken();

        // Assert
        Assert.NotEqual(token1, token2);
    }
}

