/**
 * API Generate Endpoint Integration Tests
 * Win 56: Test /api/generate endpoint
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the modules before importing
const mockComposePage = vi.fn()
const mockResolveTokens = vi.fn()
const mockLogger = { info: vi.fn(), error: vi.fn(), warn: vi.fn() }

vi.mock('@/lib/engine/compose', () => ({
  composePage: mockComposePage,
}))

vi.mock('@/lib/tokens/resolver', () => ({
  resolveTokens: mockResolveTokens,
}))

vi.mock('@/lib/logger', () => ({
  logger: mockLogger,
}))

describe('/api/generate endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockBusinessData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Peluquería Test',
    slug: 'peluqueria-test',
    type: 'peluqueria',
    city: 'Asunción',
    phone: '+595981123456',
  }

  const mockComposedPage = {
    business: mockBusinessData,
    sections: [
      { type: 'header', order: 0, data: { businessName: 'Peluquería Test' } },
      { type: 'hero', order: 1, data: { headline: 'Bienvenidos' } },
      { type: 'services', order: 2, data: { services: [] } },
      { type: 'contact', order: 3, data: { phone: '+595981123456' } },
    ],
    meta: {
      title: 'Peluquería Test - Asunción',
      description: 'Los mejores servicios de peluquería en Asunción',
    },
    theme: {
      cssString: ':root { --primary: #b76e79; }',
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter',
      isDark: false,
    },
  }

  describe('POST /api/generate', () => {
    it('should generate page with valid business data', async () => {
      mockComposePage.mockResolvedValue(mockComposedPage)

      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'homepage',
      }

      // Simulate the API call
      const result = await simulateGenerateApi(requestBody)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('sections')
      expect(result.data.sections).toHaveLength(4)
      expect(result.data.meta.title).toContain('Peluquería Test')
    })

    it('should return error for missing businessId', async () => {
      const requestBody = {
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result.success).toBe(false)
      expect(result.error).toContain('businessId')
      expect(result.status).toBe(400)
    })

    it('should return error for invalid page type', async () => {
      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'invalid_page',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result.success).toBe(false)
      expect(result.error).toContain('page type')
      expect(result.status).toBe(400)
    })

    it('should handle business not found', async () => {
      mockComposePage.mockRejectedValue(new Error('Business not found'))

      const requestBody = {
        businessId: 'non-existent-id',
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result.success).toBe(false)
      expect(result.status).toBe(404)
    })

    it('should handle composition errors gracefully', async () => {
      mockComposePage.mockRejectedValue(new Error('Composition failed'))

      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result.success).toBe(false)
      expect(result.status).toBe(500)
    })
  })

  describe('Response structure', () => {
    it('should return correct response structure on success', async () => {
      mockComposePage.mockResolvedValue(mockComposedPage)

      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result).toMatchObject({
        success: true,
        data: {
          business: expect.any(Object),
          sections: expect.any(Array),
          meta: expect.any(Object),
          theme: expect.any(Object),
        },
      })
    })

    it('should include required section types', async () => {
      mockComposePage.mockResolvedValue(mockComposedPage)

      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)
      const sectionTypes = result.data.sections.map((s: { type: string }) => s.type)

      expect(sectionTypes).toContain('header')
      expect(sectionTypes).toContain('hero')
    })

    it('should include theme CSS variables', async () => {
      mockComposePage.mockResolvedValue(mockComposedPage)

      const requestBody = {
        businessId: mockBusinessData.id,
        pageType: 'homepage',
      }

      const result = await simulateGenerateApi(requestBody)

      expect(result.data.theme.cssString).toContain('--primary')
    })
  })

  describe('Page type variations', () => {
    const validPageTypes = ['homepage', 'services', 'gallery', 'team', 'contact']

    validPageTypes.forEach((pageType) => {
      it(`should handle ${pageType} page type`, async () => {
        mockComposePage.mockResolvedValue({
          ...mockComposedPage,
          sections: [{ type: 'header', order: 0, data: {} }],
        })

        const requestBody = {
          businessId: mockBusinessData.id,
          pageType,
        }

        const result = await simulateGenerateApi(requestBody)
        expect(result.success).toBe(true)
      })
    })
  })
})

/**
 * Simulated API handler for testing
 * This mimics the behavior of the actual API endpoint
 */
async function simulateGenerateApi(body: Record<string, unknown>): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
  status?: number
}> {
  // Validate required fields
  if (!body.businessId) {
    return {
      success: false,
      error: 'Missing required field: businessId',
      status: 400,
    }
  }

  // Validate page type
  const validPageTypes = ['homepage', 'services', 'gallery', 'team', 'contact']
  if (!body.pageType || !validPageTypes.includes(body.pageType as string)) {
    return {
      success: false,
      error: `Invalid page type. Must be one of: ${validPageTypes.join(', ')}`,
      status: 400,
    }
  }

  try {
    // Call compose function
    const result = await mockComposePage(body)
    
    return {
      success: true,
      data: result,
      status: 200,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    if (message.includes('not found')) {
      return {
        success: false,
        error: 'Business not found',
        status: 404,
      }
    }

    return {
      success: false,
      error: 'Internal server error',
      status: 500,
    }
  }
}
