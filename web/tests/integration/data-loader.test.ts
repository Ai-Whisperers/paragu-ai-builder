import { describe, it, expect, beforeEach } from 'vitest'
import { loadBusiness, loadAllSlugs, loadRegistry, loadContent } from '../lib/engine/demo-data'

describe('demo-data.ts', () => {
  beforeEach(() => {
    // Reset any mocks if needed
  })

  describe('loadBusiness', () => {
    it('should load business by slug', () => {
      const business = loadBusiness('peluqueria-maria')
      expect(business).not.toBeNull()
      expect(business?.name).toBe('Peluqueria Maria')
    })

    it('should return null for non-existent slug', () => {
      const business = loadBusiness('non-existent-business')
      expect(business).toBeNull()
    })

    it('should load gymfit-py with class schedule', () => {
      const business = loadBusiness('gymfit-py')
      expect(business).not.toBeNull()
      expect(business?.classSchedule).toBeDefined()
      expect(business?.classSchedule?.length).toBeGreaterThan(0)
    })

    it('should load gymfit-py with membership plans', () => {
      const business = loadBusiness('gymfit-py')
      expect(business).not.toBeNull()
      expect(business?.membershipPlans).toBeDefined()
      expect(business?.membershipPlans?.length).toBeGreaterThan(0)
    })

    it('should load all demo businesses', () => {
      const slugs = loadAllSlugs()
      expect(slugs.length).toBeGreaterThan(0)
      expect(slugs).toContain('peluqueria-maria')
      expect(slugs).toContain('gymfit-py')
      expect(slugs).toContain('spa-serenidad')
    })
  })

  describe('loadRegistry', () => {
    it('should load peluqueria registry', () => {
      const registry = loadRegistry('peluqueria')
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('peluqueria')
    })

    it('should load gimnasio registry', () => {
      const registry = loadRegistry('gimnasio')
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('gimnasio')
    })

    it('should load spa registry', () => {
      const registry = loadRegistry('spa')
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('spa')
    })

    it('should return null for invalid type', () => {
      const registry = loadRegistry('invalid-type')
      expect(registry).toBeNull()
    })
  })

  describe('loadContent', () => {
    it('should load peluqueria content', () => {
      const content = loadContent('peluqueria')
      expect(content).not.toBeNull()
      expect(content?.hero).toBeDefined()
    })

    it('should load gimnasio content with classSchedule', () => {
      const content = loadContent('gimnasio')
      expect(content).not.toBeNull()
      expect(content?.classSchedule).toBeDefined()
    })

    it('should load spa content with membershipPlans', () => {
      const content = loadContent('spa')
      expect(content).not.toBeNull()
      expect(content?.membershipPlans).toBeDefined()
    })

    it('should return null for invalid type', () => {
      const content = loadContent('invalid-type')
      expect(content).toBeNull()
    })
  })

  describe('data integrity', () => {
    it('should have 12 business types in types.ts', () => {
      const { BUSINESS_TYPES } = require('../lib/types')
      expect(BUSINESS_TYPES.length).toBe(12)
    })

    it('should have matching registry files', () => {
      const fs = require('fs')
      const registryDir = '../src/registry'
      const files = fs.readdirSync(registryDir)
      const jsonFiles = files.filter(f => f.endsWith('.type.json'))
      expect(jsonFiles.length).toBeGreaterThanOrEqual(12)
    })

    it('should have matching content files', () => {
      const fs = require('fs')
      const contentDir = '../src/content'
      const files = fs.readdirSync(contentDir)
      const jsonFiles = files.filter(f => f.endsWith('.content.json'))
      expect(jsonFiles.length).toBeGreaterThanOrEqual(10)
    })
  })
})