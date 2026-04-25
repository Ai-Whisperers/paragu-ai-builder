import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { metrics, setMetricsBinding, type AnalyticsEngineDataset } from '@/lib/obs/metrics'

function fakeBinding(): AnalyticsEngineDataset & { calls: Array<Parameters<AnalyticsEngineDataset['writeDataPoint']>[0]> } {
  const calls: Array<Parameters<AnalyticsEngineDataset['writeDataPoint']>[0]> = []
  return {
    calls,
    writeDataPoint(point) {
      calls.push(point)
    },
  }
}

describe('metrics wrapper', () => {
  beforeEach(() => {
    setMetricsBinding(null)
  })
  afterEach(() => {
    setMetricsBinding(null)
  })

  it('is a no-op when no binding is configured', () => {
    // Should not throw, should write nothing.
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    metrics.inc('lead.accepted', { siteSlug: 'x' })
    // One log-level debug emission, no exceptions.
    logSpy.mockRestore()
  })

  it('writes indexed data points via the binding', () => {
    const binding = fakeBinding()
    setMetricsBinding(binding)
    metrics.inc('lead.accepted', { siteSlug: 'nexa-paraguay', source: 'hero' })
    expect(binding.calls).toHaveLength(1)
    const point = binding.calls[0]
    expect(point.indexes).toEqual(['lead.accepted'])
    expect(point.blobs).toEqual(expect.arrayContaining([
      'siteSlug=nexa-paraguay',
      'source=hero',
      'metric=lead.accepted',
    ]))
    expect(point.doubles).toEqual([1])
  })

  it('records timings with numeric values', () => {
    const binding = fakeBinding()
    setMetricsBinding(binding)
    metrics.timing('compose.duration', 137, { businessType: 'peluqueria' })
    const point = binding.calls[0]
    expect(point.doubles).toEqual([137])
    expect(point.blobs).toEqual(expect.arrayContaining([
      'businessType=peluqueria',
      'metric=compose.duration',
    ]))
  })

  it('honours an explicit primary index', () => {
    const binding = fakeBinding()
    setMetricsBinding(binding)
    metrics.observe('api.request', { route: '/api/leads' }, { primary: '/api/leads', values: [201] })
    expect(binding.calls[0].indexes).toEqual(['/api/leads'])
    expect(binding.calls[0].doubles).toEqual([201])
  })

  it('caps blobs and doubles at 20 entries each', () => {
    const binding = fakeBinding()
    setMetricsBinding(binding)
    const dims: Record<string, string> = {}
    for (let i = 0; i < 30; i++) dims[`k${i}`] = `v${i}`
    const values = Array.from({ length: 30 }, (_, i) => i)
    metrics.observe('api.request', dims, { values })
    expect(binding.calls[0].blobs!.length).toBeLessThanOrEqual(20)
    expect(binding.calls[0].doubles!.length).toBe(20)
  })

  it('does not throw when the binding itself throws', () => {
    const binding: AnalyticsEngineDataset = {
      writeDataPoint() {
        throw new Error('binding exploded')
      },
    }
    setMetricsBinding(binding)
    expect(() => metrics.inc('lead.accepted', {})).not.toThrow()
  })
})
