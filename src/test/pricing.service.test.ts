import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PricingService } from '@/services/pricing.service';
import { PricingRepository } from '@/repositories/pricing.repository';

// Mock PricingRepository
vi.mock('@/repositories/pricing.repository', () => ({
  PricingRepository: {
    updateRoutePricing: vi.fn(),
    getByRouteId: vi.fn(),
  },
}));

describe('PricingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call PricingRepository.updateRoutePricing with validated data', async () => {
    const routeId = 'route-1';
    const pricingData = [
      { fromStopId: 'stop-a', toStopId: 'stop-b', amount: 10.5 },
    ];

    await PricingService.updatePricing(routeId, { pricing: pricingData });

    expect(PricingRepository.updateRoutePricing).toHaveBeenCalledWith(routeId, pricingData);
  });

  it('should call PricingRepository.getByRouteId', async () => {
    const routeId = 'route-1';
    await PricingService.getPricingByRouteId(routeId);
    expect(PricingRepository.getByRouteId).toHaveBeenCalledWith(routeId);
  });
});
