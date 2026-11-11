using IndustrialCatalog.Infrastructure.Services;
using Xunit;

namespace IndustrialCatalog.UnitTests;

public class PasswordHasherTests
{
    private readonly PasswordHasher _hasher;

    public PasswordHasherTests()
    {
        _hasher = new PasswordHasher();
    }

    [Fact]
    public void HashPassword_ShouldReturnValidBcryptHash()
    {
        // Arrange
        const string rawPassword = "SecureIndustrialPassword@2026";

        // Act
        var hash = _hasher.HashPassword(rawPassword);

        // Assert
        Assert.NotNull(hash);
        Assert.NotEmpty(hash);
        Assert.StartsWith("$2", hash); // BCrypt prefix
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
    {
        // Arrange
        const string password = "AdminPassword@123456";
        var hash = _hasher.HashPassword(password);

        // Act
        var isValid = _hasher.VerifyPassword(password, hash);

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
    {
        // Arrange
        const string password = "AdminPassword@123456";
        var hash = _hasher.HashPassword(password);

        // Act
        var isValid = _hasher.VerifyPassword("WrongPassword!999", hash);

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void HashPassword_ProducesDifferentHashesForSamePassword_DueToUniqueSalts()
    {
        // Arrange
        const string password = "MachineFactoryPassword@42";

        // Act
        var hash1 = _hasher.HashPassword(password);
        var hash2 = _hasher.HashPassword(password);

        // Assert
        Assert.NotEqual(hash1, hash2);
        Assert.True(_hasher.VerifyPassword(password, hash1));
        Assert.True(_hasher.VerifyPassword(password, hash2));
    }
}

