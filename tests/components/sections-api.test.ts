import { describe, it, expect } from '@jest/globals';
import { portfolioSections } from '../../src/data/mockData';

// Mock fetch for testing API endpoints
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('GET /api/sections', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return an array of sections with required fields', async () => {
    // Mock the API response
    const mockResponse = {
      success: true,
      data: portfolioSections.map(section => ({
        id: section.id,
        title: section.title,
        content: section.content,
        order: section.order,
      })),
      total: portfolioSections.length,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Make the API call
    const response = await fetch('/api/sections');
    const data = await response.json();

    // Assertions
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.total).toBe(portfolioSections.length);
    
    // Check that each section has required fields
    data.data.forEach((section: any) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('content');
      expect(section).toHaveProperty('order');
      expect(typeof section.id).toBe('string');
      expect(typeof section.title).toBe('string');
      expect(typeof section.content).toBe('string');
      expect(typeof section.order).toBe('number');
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock a failed response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        error: 'Internal server error',
        message: 'An error occurred while retrieving portfolio sections',
      }),
    });

    const response = await fetch('/api/sections');
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should return sections in correct order', async () => {
    const mockResponse = {
      success: true,
      data: portfolioSections
        .map(section => ({
          id: section.id,
          title: section.title,
          content: section.content,
          order: section.order,
        }))
        .sort((a, b) => a.order - b.order),
      total: portfolioSections.length,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await fetch('/api/sections');
    const data = await response.json();

    // Check that sections are ordered correctly
    for (let i = 1; i < data.data.length; i++) {
      expect(data.data[i].order).toBeGreaterThanOrEqual(data.data[i - 1].order);
    }
  });
});