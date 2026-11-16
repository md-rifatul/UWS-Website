using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.OpenApi.Models;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Infrastructure;
using IndustrialCatalog.Infrastructure.Persistence;
using IndustrialCatalog.Infrastructure.Persistence.Seed;
using IndustrialCatalog.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Services (EF Core PostgreSQL, Repositories, Hashers, Tokens)
builder.Services.AddInfrastructureServices(builder.Configuration);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDataProtection()
        .UseEphemeralDataProtectionProvider();
}

// 2. Add JWT Bearer Authentication
var secretKey = builder.Configuration["Jwt:SecretKey"] 
    ?? "SUPER_SECRET_KEY_FOR_INDUSTRIAL_CATALOG_PLATFORM_WOODTECH_2026_MIN_32_CHARS!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "IndustrialCatalogApi";
var audience = builder.Configuration["Jwt:Audience"] ?? "IndustrialCatalogClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
    };
});

builder.Services.AddAuthorization();

// 3. Configure CORS (Vercel Frontend + Localhost + Credentials)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
{
    "http://localhost:3000",
    "http://localhost:5173",
    "https://uws-machinery.vercel.app",
    "https://woodtechsolutionbd.com",
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercelAndLocalClient", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Critical for HTTP-only refresh cookies
    });
});

// 4. Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WoodTech Industrial Machinery Catalog API",
        Version = "v1",
        Description = "Enterprise RESTful Web API for industrial equipment catalog, dynamic technical attribute schemas (PostgreSQL JSONB), and Request for Quote (RFQ) workflows.",
        Contact = new OpenApiContact
        {
            Name = "WoodTech Solutions Engineering Desk",
            Email = "info@woodtechsolutionbd.com",
            Url = new Uri("https://woodtechsolutionbd.com"),
        }
    });

    // XML Documentation
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Add JWT Bearer Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter your JWT token directly below (Swagger automatically attaches 'Bearer ').",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 5. Seed Database & apply pending migrations
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = services.GetRequiredService<IPasswordHasher>();

        if (context.Database.IsNpgsql())
        {
            await context.Database.MigrateAsync();
        }
        else
        {
            await context.Database.EnsureCreatedAsync();
        }

        await DatabaseSeeder.SeedAsync(context, passwordHasher);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration or seeding.");
    }
}

// 6. HTTP Pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Always enable Swagger for local testing, development, and documentation
if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("EnableSwaggerInProduction", true))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WoodTech Catalog API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "WoodTech Industrial API - Swagger UI";
        c.EnablePersistAuthorization();
        c.DisplayRequestDuration();
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowVercelAndLocalClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow,
    service = "WoodTech Industrial Catalog Web API v1.0",
    environment = app.Environment.EnvironmentName,
}));

// Root redirect directly to Swagger UI for convenience
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
