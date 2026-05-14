import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouteService } from '@/services/route.service';
import { prisma } from '@/lib/prisma';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    route: {
      findMany: vi.fn(),
    },
    booking: {
      count: vi.fn(),
    },
  },
}));

describe('RouteService.searchRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return routes where from stop is before to stop', async () => {
    const mockRoutes = [
      {
        id: 'route-1',
        name: 'Route 1',
        status: 'ACTIVE',
        capacity: 50,
        stops: [
          { name: 'Stop A', orderIndex: 0 },
          { name: 'Stop B', orderIndex: 1 },
          { name: 'Stop C', orderIndex: 2 },
        ],
      },
    ];

    (prisma.route.findMany as any).mockResolvedValue(mockRoutes);
    (prisma.booking.count as any).mockResolvedValue(10);

    const result = await RouteService.searchRoutes('Stop A', 'Stop C');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('route-1');
    expect(result[0].seatsRemaining).toBe(40);
  });

  it('should filter out routes where from stop is after to stop', async () => {
    const mockRoutes = [
      {
        id: 'route-2',
        name: 'Route 2',
        status: 'ACTIVE',
        stops: [
          { name: 'Stop C', orderIndex: 0 },
          { name: 'Stop B', orderIndex: 1 },
          { name: 'Stop A', orderIndex: 2 },
        ],
      },
    ];

    (prisma.route.findMany as any).mockResolvedValue(mockRoutes);

    const result = await RouteService.searchRoutes('Stop A', 'Stop C');
    
    expect(result).toHaveLength(0);
  });

  it('should filter out routes missing one of the stops', async () => {
    const mockRoutes = [
      {
        id: 'route-3',
        name: 'Route 3',
        status: 'ACTIVE',
        stops: [
          { name: 'Stop A', orderIndex: 0 },
          { name: 'Stop B', orderIndex: 1 },
        ],
      },
    ];

    (prisma.route.findMany as any).mockResolvedValue(mockRoutes);

    const result = await RouteService.searchRoutes('Stop A', 'Stop C');
    
    expect(result).toHaveLength(0);
  });
});
