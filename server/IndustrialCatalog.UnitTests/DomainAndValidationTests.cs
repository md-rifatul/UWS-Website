using System.Text.Json;
using IndustrialCatalog.Domain.Entities;
using IndustrialCatalog.Domain.Enums;
using Xunit;

namespace IndustrialCatalog.UnitTests;

public class DomainAndValidationTests
{
    [Fact]
    public void Product_SpecificationsJson_ShouldSerializeAndDeserializeDynamicAttributes()
    {
        // Arrange
        var dynamicSpecs = new Dictionary<string, object>
        {
            { "travelling_size", "1300 x 2500 x 200 mm" },
            { "spindle_power", "9.0 kW Italian ATC" },
            { "control_system", "Syntec 6MB" },
            { "max_feed_speed", 65 },
            { "has_vacuum_table", true }
        };

        var json = JsonSerializer.Serialize(dynamicSpecs);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "WTS Prime-1325 Heavy Duty ATC CNC Router",
            ModelNumber = "WTS-1325-ATC",
            SKU = "CNC-RTR-001",
            Slug = "wts-prime-1325-atc-cnc-router",
            SpecificationsJson = json,
            AvailabilityStatus = AvailabilityStatus.InStock,
            Condition = MachineCondition.BrandNew,
            IsFeatured = true,
            IsActive = true
        };

        // Act
        var deserialized = JsonSerializer.Deserialize<Dictionary<string, object>>(product.SpecificationsJson);

        // Assert
        Assert.NotNull(deserialized);
        Assert.True(deserialized.ContainsKey("travelling_size"));
        Assert.True(deserialized.ContainsKey("spindle_power"));
        Assert.True(deserialized.ContainsKey("control_system"));
        Assert.True(deserialized.ContainsKey("max_feed_speed"));
        Assert.True(deserialized.ContainsKey("has_vacuum_table"));
    }

    [Fact]
    public void RFQ_StatusWorkflow_ShouldSupportProperStatusTransitions()
    {
        // Arrange
        var rfq = new RFQ
        {
            Id = Guid.NewGuid(),
            ReferenceNumber = "RFQ-2026-0042",
            CompanyName = "Apex Woodcraft Ltd.",
            ContactName = "Rafiqul Islam",
            Phone = "+880 1711-223344",
            Email = "procurement@apexwoodcraft.com",
            Status = RFQStatus.Pending,
            Priority = RFQPriority.High,
            CreatedAtUtc = DateTime.UtcNow
        };

        // Assert initial status
        Assert.Equal(RFQStatus.Pending, rfq.Status);

        // Act & Assert Transition to UnderReview
        rfq.Status = RFQStatus.UnderReview;
        Assert.Equal(RFQStatus.UnderReview, rfq.Status);

        // Act & Assert Transition to QuotationSent
        rfq.Status = RFQStatus.QuotationSent;
        Assert.Equal(RFQStatus.QuotationSent, rfq.Status);

        // Act & Assert Transition to Completed
        rfq.Status = RFQStatus.Completed;
        Assert.Equal(RFQStatus.Completed, rfq.Status);
    }

    [Fact]
    public void Category_Attributes_ShouldMaintainRelationalHierarchy()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new Category
        {
            Id = categoryId,
            Name = "CNC ROUTER MACHINE",
            Slug = "cnc-router-machine",
            DisplayOrder = 1,
            IsActive = true,
            Attributes = new List<CategoryAttribute>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = categoryId,
                    AttributeKey = "working_area",
                    Label = "Working Area (X x Y)",
                    DataType = AttributeDataType.Text,
                    Unit = "mm",
                    IsFilterable = true,
                    IsRequired = true,
                    DisplayOrder = 1
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = categoryId,
                    AttributeKey = "spindle_power",
                    Label = "Spindle Power",
                    DataType = AttributeDataType.Dropdown,
                    Unit = "kW",
                    OptionsJson = "[\"6.0 kW\",\"9.0 kW\",\"12.0 kW\"]",
                    IsFilterable = true,
                    IsRequired = true,
                    DisplayOrder = 2
                }
            }
        };

        // Assert
        Assert.Equal(2, category.Attributes.Count);
        Assert.Contains(category.Attributes, a => a.AttributeKey == "working_area");
        Assert.Contains(category.Attributes, a => a.AttributeKey == "spindle_power");
        Assert.All(category.Attributes, a => Assert.Equal(categoryId, a.CategoryId));
    }
}

