using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.Services;
using IndustrialCatalog.Infrastructure.Persistence;
using IndustrialCatalog.Infrastructure.Services;

namespace IndustrialCatalog.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Database=industrial_catalog;Username=postgres;Password=postgres";

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString, b =>
            {
                b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
            });
        });

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // Singletons / Scoped Services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<IRfqService, RfqService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<ICloudinaryService, CloudinaryService>();

        return services;
    }
}
