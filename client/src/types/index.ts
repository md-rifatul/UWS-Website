export type MachineCondition = 'BrandNew' | 'FactoryRefurbished' | 'CertifiedPreOwned';
export type AvailabilityStatus = 'InStock' | 'AvailableToOrder' | 'ManufacturingLeadTime' | 'PreOrder' | 'Discontinued';
export type AttributeDataType = 'Text' | 'Number' | 'Boolean' | 'Dropdown' | 'MultiSelect';
export type RFQStatus = 'Pending' | 'UnderReview' | 'Assigned' | 'QuotationSent' | 'Approved' | 'Rejected' | 'Completed';
export type RFQPriority = 'Normal' | 'High' | 'Urgent';
export type UserRole = 'Admin' | 'SalesManager' | 'CorporateBuyer' | 'AnonymousViewer';

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  attributeKey: string;
  label: string;
  dataType: AttributeDataType;
  unit?: string | null;
  optionsJson?: string | null;
  options?: string[];
  isFilterable: boolean;
  isRequired: boolean;
  displayOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  iconName?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  attributes?: CategoryAttribute[];
  subCategories?: Category[];
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  isActive: boolean;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductDocument {
  id: string;
  title: string;
  documentUrl: string;
  fileSizeBytes?: number | null;
  fileType: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  subCategory?: string;
  manufacturerId: string;
  manufacturerName?: string;
  name: string;
  slug: string;
  modelNumber: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  mainImageUrl: string;
  condition: MachineCondition;
  availabilityStatus: AvailabilityStatus;
  referencePrice?: number | null;
  showPrice: boolean;
  isFeatured: boolean;
  viewCount: number;
  isActive: boolean;
  specifications: Record<string, any>;
  images: ProductImage[];
  documents: ProductDocument[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface RFQItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  customRequirements?: string;
  selectedConfigurations?: Record<string, any>;
  notes?: string;
}

export interface RFQ {
  id: string;
  referenceNumber: string;
  userId?: string | null;
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  industryType?: string | null;
  city?: string | null;
  country?: string | null;
  status: RFQStatus;
  priority: RFQPriority;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  targetDeliveryDate?: string | null;
  estimatedBudget?: number | null;
  adminNotes?: string | null;
  clientNotes?: string | null;
  items: RFQItem[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName?: string | null;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAtUtc: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresInMinutes: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProductFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
  manufacturerSlug?: string;
  condition?: MachineCondition;
  availability?: AvailabilityStatus;
  isFeatured?: boolean;
  sortBy?: 'name_asc' | 'name_desc' | 'newest' | 'views';
  specs?: Record<string, string | number>;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetSlug?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  group: string;
  description?: string | null;
}

export interface BulkImportResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  errors: string[];
}


