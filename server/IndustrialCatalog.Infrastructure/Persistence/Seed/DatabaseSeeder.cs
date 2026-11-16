using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;

namespace IndustrialCatalog.Infrastructure.Persistence.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        // 1. Seed Users
        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                Id = Guid.Parse("11111111-aaaa-bbbb-cccc-111111111111"),
                Email = "admin@woodtech.com",
                PasswordHash = passwordHasher.HashPassword("Admin@123456"),
                FullName = "Executive Platform Admin",
                CompanyName = "WoodTech Solutions HQ",
                Phone = "+880 1700-000001",
                Role = UserRole.Admin,
                IsActive = true,
            };

            var buyer = new User
            {
                Id = Guid.Parse("22222222-aaaa-bbbb-cccc-222222222222"),
                Email = "buyer@apexwoodcraft.com",
                PasswordHash = passwordHasher.HashPassword("Buyer@123456"),
                FullName = "Engr. Tariqul Islam",
                CompanyName = "Apex Woodcraft Industries Ltd.",
                Phone = "+880 1711-234567",
                Role = UserRole.CorporateBuyer,
                IsActive = true,
            };

            context.Users.AddRange(admin, buyer);
            await context.SaveChangesAsync();
        }

        // 2. Seed Manufacturers
        if (!await context.Manufacturers.AnyAsync())
        {
            var manufacturers = new List<Manufacturer>
            {
                new()
                {
                    Id = Guid.Parse("a4444444-4444-4444-4444-444444444444"),
                    Name = "UWS Industrial Tech",
                    Slug = "uws-industrial-tech",
                    Country = "Bangladesh",
                    LogoUrl = "https://res.cloudinary.com/dtg0a6y8x/image/upload/v1/uws-branding/uws_logo.png",
                    WebsiteUrl = "https://www.uwsbd.com",
                    Description = "High-precision industrial CNC machinery, motion automation controllers, and turnkey spare parts.",
                },
            };

            context.Manufacturers.AddRange(manufacturers);
            await context.SaveChangesAsync();
        }

        // 3. Seed Categories & Dynamic Attributes
        if (!await context.Categories.AnyAsync())
        {
            var cncCatId = Guid.Parse("c1111111-1111-1111-1111-111111111111");
            var accCatId = Guid.Parse("c2222222-2222-2222-2222-222222222222");
            var motCatId = Guid.Parse("c3333333-3333-3333-3333-333333333333");
            var drvCatId = Guid.Parse("c4444444-4444-4444-4444-444444444444");
            var spnCatId = Guid.Parse("c5555555-5555-5555-5555-555555555555");
            var invCatId = Guid.Parse("c6666666-6666-6666-6666-666666666666");
            var rmtCatId = Guid.Parse("c7777777-7777-7777-7777-777777777777");

            var categories = new List<Category>
            {
                new()
                {
                    Id = cncCatId,
                    Name = "CNC ROUTER MACHINE",
                    Slug = "cnc-router-machine",
                    Description = "High-precision multi-axis CNC routers, nesting machines, and heavy-duty 5-axis machining centers.",
                    ImageUrl = null,
                    DisplayOrder = 1,
                    Attributes = new List<CategoryAttribute>
                    {
                        new() { AttributeKey = "working_area", Label = "Working Area (X x Y)", DataType = AttributeDataType.Text, Unit = "mm", IsFilterable = true, IsRequired = true, DisplayOrder = 1 },
                        new() { AttributeKey = "spindle_power", Label = "Spindle Power", DataType = AttributeDataType.Dropdown, Unit = "kW", OptionsJson = "[\"6.0 kW\",\"9.0 kW\",\"12.0 kW\",\"16.0 kW\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 2 },
                        new() { AttributeKey = "control_system", Label = "CNC Control System", DataType = AttributeDataType.Dropdown, OptionsJson = "[\"Syntec 6MB (Taiwan)\",\"Siemens 808D\",\"DSP Handheld\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 3 },
                    }
                },
                new()
                {
                    Id = accCatId,
                    Name = "ACCESSORIES",
                    Slug = "accessories",
                    Description = "Precision CNC collets, tool chuck holders, automatic tool setters, hold-down clamps, and vacuum accessories.",
                    ImageUrl = null,
                    DisplayOrder = 2,
                },
                new()
                {
                    Id = motCatId,
                    Name = "MOTOR",
                    Slug = "motor",
                    Description = "High torque AC brushless servo motors, hybrid stepper motors, and closed-loop motion drive packages.",
                    ImageUrl = null,
                    DisplayOrder = 3,
                },
                new()
                {
                    Id = drvCatId,
                    Name = "DRIVE",
                    Slug = "drive",
                    Description = "High-performance digital AC servo drives, microstepping motor drivers, and multi-axis motion amplifiers.",
                    ImageUrl = null,
                    DisplayOrder = 4,
                },
                new()
                {
                    Id = spnCatId,
                    Name = "SPINDLE",
                    Slug = "spindle",
                    Description = "Industrial air-cooled and water-cooled high-speed electro-spindles (up to 24,000 RPM) and ATC spindles.",
                    ImageUrl = null,
                    DisplayOrder = 5,
                },
                new()
                {
                    Id = invCatId,
                    Name = "INVERTER",
                    Slug = "inverter",
                    Description = "Variable frequency drives (VFD) and vector frequency inverters for smooth spindle speed control.",
                    ImageUrl = null,
                    DisplayOrder = 6,
                },
                new()
                {
                    Id = rmtCatId,
                    Name = "REMOTE",
                    Slug = "remote",
                    Description = "DSP handheld motion controllers (RichAuto A11/A18), wireless MPG handwheels, and CNC pendants.",
                    ImageUrl = null,
                    DisplayOrder = 7,
                },
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // 4. Seed Products
        // No demo products seeded. Catalog starts clean; admin adds genuine products via Admin Dashboard.
        if (!await context.Products.AnyAsync())
        {
            // Catalog starts clean with 0 demo products
        }
    }
}

