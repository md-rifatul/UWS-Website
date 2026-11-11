namespace IndustrialCatalog.Domain.Enums;

public enum AttributeDataType
{
    Text = 1,
    Number = 2,
    Boolean = 3,
    Dropdown = 4,
    MultiSelect = 5
}

public enum MachineCondition
{
    BrandNew = 1,
    FactoryRefurbished = 2,
    CertifiedPreOwned = 3
}

public enum AvailabilityStatus
{
    InStock = 1,
    AvailableToOrder = 2,
    ManufacturingLeadTime = 3,
    PreOrder = 4,
    Discontinued = 5
}

public enum RFQStatus
{
    Pending = 1,
    UnderReview = 2,
    Assigned = 3,
    QuotationSent = 4,
    Approved = 5,
    Rejected = 6,
    Completed = 7
}

public enum RFQPriority
{
    Normal = 1,
    High = 2,
    Urgent = 3
}

public enum UserRole
{
    Admin = 1,
    SalesManager = 2,
    CorporateBuyer = 3,
    AnonymousViewer = 4
}

