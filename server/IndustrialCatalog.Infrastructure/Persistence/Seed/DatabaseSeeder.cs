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

        // 4. Seed Products with rich PostgreSQL JSONB specifications
        if (!await context.Products.AnyAsync())
        {
            var cncCatId = Guid.Parse("c1111111-1111-1111-1111-111111111111");
            var accCatId = Guid.Parse("c2222222-2222-2222-2222-222222222222");
            var motCatId = Guid.Parse("c3333333-3333-3333-3333-333333333333");
            var drvCatId = Guid.Parse("c4444444-4444-4444-4444-444444444444");
            var spnCatId = Guid.Parse("c5555555-5555-5555-5555-555555555555");
            var invCatId = Guid.Parse("c6666666-6666-6666-6666-666666666666");
            var rmtCatId = Guid.Parse("c7777777-7777-7777-7777-777777777777");

            var mUws = Guid.Parse("a4444444-4444-4444-4444-444444444444");

            var products = new List<Product>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = cncCatId,
                    ManufacturerId = mUws,
                    Name = "WTS Prime-1325 Heavy Duty ATC CNC Router",
                    Slug = "wts-prime-1325-atc-cnc-router",
                    ModelNumber = "WTS-1325-ATC",
                    SKU = "CNC-RTR-001",
                    ShortDescription = "Industrial-grade 9.0kW Italian ATC spindle with 12-tool carousel, Syntec controller, and vacuum table.",
                    FullDescription = "Tempered stress-relieved steel gantry, Japanese Yaskawa AC servos, repeatable 0.02mm positioning accuracy for heavy 3-shift factory conditions.",
                    MainImageUrl = null,
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
                    CategoryId = accCatId,
                    ManufacturerId = mUws,
                    Name = "UWS ER32 High Precision Spring Collet & Nut Kit",
                    Slug = "uws-er32-high-precision-collet-set",
                    ModelNumber = "UWS-COL-ER32",
                    SKU = "UWS-ACC-01",
                    ShortDescription = "Ultra-precision ER32 spring collet chuck set (3mm–20mm) with clamping nut and wrench.",
                    FullDescription = "High carbon alloy steel ER32 collets manufactured to 0.005mm runout tolerance for vibration-free high RPM CNC milling.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 890,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "accessory_type", "ER Collet & Nut" },
                        { "collet_standard", "ER32" },
                        { "concentricity", "< 0.005 mm" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = motCatId,
                    ManufacturerId = mUws,
                    Name = "UWS 1.5kW AC Servo Motor High Torque",
                    Slug = "uws-1-5kw-ac-servo-motor",
                    ModelNumber = "UWS-SM-1500",
                    SKU = "UWS-MOT-01",
                    ShortDescription = "130mm flange AC brushless servo motor delivering 6.0 N.m rated torque at 2500 RPM.",
                    FullDescription = "IP65 sealed industrial AC synchronous servo motor with 2500 PPR optical / 17-bit magnetic encoder for CNC multi-axis drives.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 760,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "power_rating", "1.5 kW" },
                        { "rated_speed", "2500 RPM" },
                        { "rated_torque", "6.0 N.m" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = drvCatId,
                    ManufacturerId = mUws,
                    Name = "UWS Digital AC Servo Drive Controller",
                    Slug = "uws-digital-ac-servo-drive-system",
                    ModelNumber = "UWS-DRV-1500",
                    SKU = "UWS-DRV-01",
                    ShortDescription = "DSP-controlled intelligent servo driver compatible with 1.0kW–2.0kW AC motors.",
                    FullDescription = "32-bit DSP vector control algorithm with real-time vibration suppression, electronic gear ratio, and position/speed/torque operating modes.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 690,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "control_method", "DSP Vector Control" },
                        { "input_voltage", "AC 220V Single/3-Phase" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = spnCatId,
                    ManufacturerId = mUws,
                    Name = "UWS 4.5kW Air-Cooled High Speed Electro-Spindle",
                    Slug = "uws-4-5kw-air-cooled-spindle",
                    ModelNumber = "UWS-SPN-45A",
                    SKU = "UWS-SPN-01",
                    ShortDescription = "Heavy duty 4.5kW air-cooled milling electro-spindle with ER32 collet, 18,000 RPM.",
                    FullDescription = "Precision angular contact ceramic-steel hybrid bearings, dynamic balancing to G0.4 standard for noise-free continuous cutting.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1120,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "cooling_type", "Air Cooled" },
                        { "power_rating", "4.5 kW" },
                        { "max_rpm", "18,000 RPM" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = invCatId,
                    ManufacturerId = mUws,
                    Name = "UWS 5.5kW High Frequency VFD Vector Inverter",
                    Slug = "uws-5-5kw-vfd-vector-inverter",
                    ModelNumber = "UWS-INV-5500",
                    SKU = "UWS-INV-01",
                    ShortDescription = "Wide-band 0–1000Hz output vector frequency inverter for high-speed CNC electro-spindles.",
                    FullDescription = "Advanced sensorless vector control (SVC), PID feedback loop, built-in braking unit, and multi-step programmable speed curve.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 880,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "power_rating", "5.5 kW" },
                        { "input_voltage", "3-Phase 380V" },
                        { "output_frequency", "0 - 1000 Hz" }
                    })
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = rmtCatId,
                    ManufacturerId = mUws,
                    Name = "UWS RichAuto A11 3-Axis DSP Handheld Controller",
                    Slug = "uws-richauto-a11-dsp-controller",
                    ModelNumber = "UWS-RMT-A11",
                    SKU = "UWS-RMT-01",
                    ShortDescription = "Standalone offline CNC motion controller pendant with 512MB internal storage and USB drive support.",
                    FullDescription = "Complete standalone operation without a host computer. Supports standard G-code, automatic tool offset, origin save on power failure.",
                    MainImageUrl = null,
                    Condition = MachineCondition.BrandNew,
                    AvailabilityStatus = AvailabilityStatus.InStock,
                    IsFeatured = true,
                    ViewCount = 1340,
                    SpecificationsJson = JsonSerializer.Serialize(new Dictionary<string, object>
                    {
                        { "axis_support", "3-Axis (X, Y, Z)" },
                        { "interface", "USB Flash Drive + Handheld DSP" }
                    })
                },
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}

