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
                    Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                    Name = "Nanxing Machinery",
                    Slug = "nanxing-machinery",
                    Country = "China",
                    LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
                    WebsiteUrl = "https://www.nanxing.com",
                    Description = "Global pioneer in automated panel processing, computerized beam saws, and edgebanders.",
                },
                new()
                {
                    Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                    Name = "KDT Machinery",
                    Slug = "kdt-machinery",
                    Country = "China",
                    LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
                    WebsiteUrl = "https://www.kdtmac.com",
                    Description = "Leading global provider of CNC drilling solutions, industrial edgebanders, and nesting cells.",
                },
                new()
                {
                    Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                    Name = "Homag Group Partner",
                    Slug = "homag-group",
                    Country = "Germany",
                    LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
                    WebsiteUrl = "https://www.homag.com",
                    Description = "Precision German engineered wood processing machinery and high-end manufacturing lines.",
                },
                new()
                {
                    Id = Guid.Parse("a4444444-4444-4444-4444-444444444444"),
                    Name = "WoodTech Prime Tech",
                    Slug = "woodtech-prime",
                    Country = "Taiwan",
                    LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
                    WebsiteUrl = "https://woodtechsolutionbd.com",
                    Description = "Customized heavy-duty industrial machinery engineered for tropical climates and continuous operation.",
                },
            };

            context.Manufacturers.AddRange(manufacturers);
            await context.SaveChangesAsync();
        }

        // 3. Seed Categories & Dynamic Attributes
        if (!await context.Categories.AnyAsync())
        {
            var cncCatId = Guid.Parse("c1111111-1111-1111-1111-111111111111");
            var edgeCatId = Guid.Parse("c2222222-2222-2222-2222-222222222222");
            var sawCatId = Guid.Parse("c3333333-3333-3333-3333-333333333333");
            var boringCatId = Guid.Parse("c4444444-4444-4444-4444-444444444444");
            var sandingCatId = Guid.Parse("c5555555-5555-5555-5555-555555555555");
            var pressCatId = Guid.Parse("c6666666-6666-6666-6666-666666666666");
            var dustCatId = Guid.Parse("c7777777-7777-7777-7777-777777777777");

            var categories = new List<Category>
            {
                new()
                {
                    Id = cncCatId,
                    Name = "CNC Machining Centers",
                    Slug = "cnc-machining-centers",
                    Description = "High-precision multi-axis CNC routers, nesting machines, and heavy-duty 5-axis machining centers.",
                    ImageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 1,
                    Attributes = new List<CategoryAttribute>
                    {
                        new() { AttributeKey = "working_area", Label = "Working Area (X x Y)", DataType = AttributeDataType.Text, Unit = "mm", IsFilterable = true, IsRequired = true, DisplayOrder = 1 },
                        new() { AttributeKey = "spindle_power", Label = "Spindle Power", DataType = AttributeDataType.Dropdown, Unit = "kW", OptionsJson = "[\"6.0 kW\",\"9.0 kW\",\"12.0 kW\",\"16.0 kW\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 2 },
                        new() { AttributeKey = "control_system", Label = "CNC Control System", DataType = AttributeDataType.Dropdown, OptionsJson = "[\"Syntec 6MB (Taiwan)\",\"Siemens 808D\",\"OSAI Open-Control (Italy)\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 3 },
                    }
                },
                new()
                {
                    Id = edgeCatId,
                    Name = "Automatic Edge Banding",
                    Slug = "edge-banding-machines",
                    Description = "High-speed automatic edgebanders with pre-milling, corner rounding, dual gluing, and buffing units.",
                    ImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 2,
                    Attributes = new List<CategoryAttribute>
                    {
                        new() { AttributeKey = "feed_speed", Label = "Feed Speed", DataType = AttributeDataType.Text, Unit = "m/min", IsFilterable = true, IsRequired = true, DisplayOrder = 1 },
                        new() { AttributeKey = "tape_thickness", Label = "Tape Thickness", DataType = AttributeDataType.Text, Unit = "mm", IsFilterable = true, IsRequired = true, DisplayOrder = 2 },
                        new() { AttributeKey = "glue_system", Label = "Gluing System", DataType = AttributeDataType.Dropdown, OptionsJson = "[\"EVA Standard Pot\",\"PUR & EVA Dual System\",\"Hot Air Zero-Joint\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 3 },
                    }
                },
                new()
                {
                    Id = sawCatId,
                    Name = "Precision Panel Saws",
                    Slug = "panel-saws",
                    Description = "Heavy duty computerized beam saws and sliding table saws for chip-free panel cutting.",
                    ImageUrl = "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 3,
                    Attributes = new List<CategoryAttribute>
                    {
                        new() { AttributeKey = "cutting_length", Label = "Max Cutting Length", DataType = AttributeDataType.Text, Unit = "mm", IsFilterable = true, IsRequired = true, DisplayOrder = 1 },
                        new() { AttributeKey = "main_saw_power", Label = "Main Saw Motor Power", DataType = AttributeDataType.Dropdown, Unit = "kW", OptionsJson = "[\"5.5 kW\",\"7.5 kW\",\"11.0 kW\",\"15.0 kW\"]", IsFilterable = true, IsRequired = true, DisplayOrder = 2 },
                    }
                },
                new()
                {
                    Id = boringCatId,
                    Name = "CNC Boring & Drilling",
                    Slug = "cnc-boring-drilling",
                    Description = "Six-sided high-speed boring machines and multi-spindle drilling lines for modern modular furniture.",
                    ImageUrl = "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 4,
                },
                new()
                {
                    Id = sandingCatId,
                    Name = "Sanding & Surface Finishing",
                    Slug = "sanding-finishing",
                    Description = "Wide belt calibrating and fine finish sanders, lacquer sanding, and profile brush polishers.",
                    ImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 5,
                },
                new()
                {
                    Id = pressCatId,
                    Name = "Hydraulic Cold & Hot Presses",
                    Slug = "hydraulic-presses",
                    Description = "Industrial veneer presses, multi-daylight hot presses, and laminating presses for solid wood and MDF.",
                    ImageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 6,
                },
                new()
                {
                    Id = dustCatId,
                    Name = "Dust Extraction Systems",
                    Slug = "dust-extraction",
                    Description = "Factory-grade central pulse-jet baghouses and modular cyclone dust extraction units.",
                    ImageUrl = "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 7,
                },
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // 4. Seed Products with rich PostgreSQL JSONB specifications
        if (!await context.Products.AnyAsync())
        {
            var cncCatId = Guid.Parse("c1111111-1111-1111-1111-111111111111");
            var edgeCatId = Guid.Parse("c2222222-2222-2222-2222-222222222222");
            var sawCatId = Guid.Parse("c3333333-3333-3333-3333-333333333333");
            var boringCatId = Guid.Parse("c4444444-4444-4444-4444-444444444444");
            var sandingCatId = Guid.Parse("c5555555-5555-5555-5555-555555555555");
            var pressCatId = Guid.Parse("c6666666-6666-6666-6666-666666666666");
            var dustCatId = Guid.Parse("c7777777-7777-7777-7777-777777777777");

            var m1 = Guid.Parse("a1111111-1111-1111-1111-111111111111");
            var m2 = Guid.Parse("a2222222-2222-2222-2222-222222222222");
            var m3 = Guid.Parse("a3333333-3333-3333-3333-333333333333");
            var m4 = Guid.Parse("a4444444-4444-4444-4444-444444444444");

            var products = new List<Product>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = cncCatId,
                    ManufacturerId = m4,
                    Name = "WTS Prime-1325 Heavy Duty ATC CNC Router",
                    Slug = "wts-prime-1325-atc-cnc-router",
                    ModelNumber = "WTS-1325-ATC",
                    SKU = "CNC-RTR-001",
                    ShortDescription = "Industrial-grade 9.0kW Italian ATC spindle with 12-tool carousel, Syntec controller, and vacuum table.",
                    FullDescription = "Tempered stress-relieved steel gantry, Japanese Yaskawa AC servos, repeatable 0.02mm positioning accuracy for heavy 3-shift factory conditions.",
                    MainImageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1420,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "working_area", "1300 x 2500 x 300 mm" },
                        { "spindle_power", "9.0 kW" },
                        { "tool_changer", "Carousel 12-slot" },
                        { "control_system", "Syntec 6MB (Taiwan)" },
                        { "vacuum_pump", "7.5 kW Liquid Ring" },
                        { "rapid_speed", "65 m/min" },
                        { "machine_weight", "2400 kg" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = edgeCatId,
                    ManufacturerId = m1,
                    Name = "Nanxing NB6PC High Speed Automatic Edgebander",
                    Slug = "nanxing-nb6pc-high-speed-edgebander",
                    ModelNumber = "NB6PC",
                    SKU = "EDG-BND-003",
                    ShortDescription = "Full-function edgebander with pre-milling, corner rounding, scraper, and dual buffing units.",
                    FullDescription = "Dual diamond pre-milling cutters, pneumatic glue pot feeding, two-motor end trimming, rough and fine trimming, corner rounding, buffing wheels.",
                    MainImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1670,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "feed_speed", "16 - 24 m/min" },
                        { "tape_thickness", "0.4 - 3.0 mm" },
                        { "glue_system", "EVA Standard Pot" },
                        { "corner_rounding", true },
                        { "total_power", "18.5 kW" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = sawCatId,
                    ManufacturerId = m1,
                    Name = "Nanxing NPC-330 Computerized Beam Panel Saw",
                    Slug = "nanxing-npc-330-beam-panel-saw",
                    ModelNumber = "NPC-330",
                    SKU = "SAW-BEM-005",
                    ShortDescription = "Heavy-duty automatic pressure beam saw with 15kW main blade, optimized cutting software, and air flotation tables.",
                    FullDescription = "Intelligent pattern optimization software with barcode printing to minimize material waste and eliminate human layout errors.",
                    MainImageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1890,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "cutting_length", "3300 mm" },
                        { "main_saw_power", "15.0 kW" },
                        { "scoring_saw_power", "2.2 kW" },
                        { "max_cutting_thickness", "90 mm" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = boringCatId,
                    ManufacturerId = m2,
                    Name = "KDT KD-612HS Six-Sided CNC Drilling Center",
                    Slug = "kdt-kd-612hs-six-sided-cnc-drilling-center",
                    ModelNumber = "KD-612HS",
                    SKU = "BOR-SIX-007",
                    ShortDescription = "Simultaneous top and bottom drilling, horizontal boring, grooving saw, and routing in a single pass.",
                    FullDescription = "Six-sided panel drilling without flipping panels. Dual independent air-floating clamps ensure zero scratches on delicate melamine.",
                    MainImageUrl = "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80",
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1350,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "boring_sides", "Six-Sided Simultaneous" },
                        { "max_panel_length", "2800 mm" },
                        { "spindle_power", "3.5 kW Routing" }
                    })
                },
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}

