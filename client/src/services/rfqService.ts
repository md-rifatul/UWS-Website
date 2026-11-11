import apiClient from './apiClient';
import { RFQ, RFQItem } from '@/types';
import { DEMO_RFQS } from './mockData';

export interface SubmitRfqDto {
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  industryType?: string;
  city?: string;
  country?: string;
  targetDeliveryDate?: string;
  estimatedBudget?: number;
  clientNotes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    customRequirements?: string;
    selectedConfigurations?: Record<string, any>;
  }>;
}

export const rfqService = {
  async submitRfq(dto: SubmitRfqDto): Promise<{ success: boolean; referenceNumber: string; rfq: RFQ }> {
    try {
      const response = await apiClient.post('/quotes', dto);
      return response.data;
    } catch {
      // Local fallback simulation with realistic reference number generation
      const year = new Date().getFullYear();
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const referenceNumber = `RFQ-${year}-${randomSeq}`;

      const newRfq: RFQ = {
        id: `rfq-${Date.now()}`,
        referenceNumber,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        companyName: dto.companyName,
        industryType: dto.industryType,
        city: dto.city,
        country: dto.country || 'Bangladesh',
        status: 'Pending',
        priority: 'Normal',
        targetDeliveryDate: dto.targetDeliveryDate,
        estimatedBudget: dto.estimatedBudget,
        clientNotes: dto.clientNotes,
        items: dto.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          customRequirements: it.customRequirements,
          selectedConfigurations: it.selectedConfigurations,
        })),
        createdAtUtc: new Date().toISOString(),
      };

      DEMO_RFQS.unshift(newRfq);
      return {
        success: true,
        referenceNumber,
        rfq: newRfq,
      };
    }
  },

  async getUserRfqs(): Promise<RFQ[]> {
    try {
      const response = await apiClient.get<RFQ[]>('/quotes/user');
      return response.data;
    } catch {
      return DEMO_RFQS;
    }
  },

  async getRfqByReference(refNumber: string): Promise<RFQ | null> {
    try {
      const response = await apiClient.get<RFQ>(`/quotes/ref/${refNumber}`);
      return response.data;
    } catch {
      return DEMO_RFQS.find((r) => r.referenceNumber === refNumber) || null;
    }
  },
};

