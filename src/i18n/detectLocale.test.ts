import { describe, expect, it } from 'vitest'
import { detectLocale } from './detectLocale'

describe('detectLocale', () => {
  it('picks es for Spanish variants', () => {
    expect(detectLocale(['es-ES'])).toBe('es')
    expect(detectLocale(['es-AR'])).toBe('es')
    expect(detectLocale(['es'])).toBe('es')
  })

  it('is case-insensitive', () => {
    expect(detectLocale(['ES-es'])).toBe('es')
  })

  it('picks en for English', () => {
    expect(detectLocale(['en-US'])).toBe('en')
    expect(detectLocale(['en-GB'])).toBe('en')
  })

  it('falls back to en for any other language', () => {
    expect(detectLocale(['fr-FR'])).toBe('en')
    expect(detectLocale(['pt-BR'])).toBe('en')
    expect(detectLocale(['de-DE'])).toBe('en')
  })

  it('falls back to en when there is no language info', () => {
    expect(detectLocale([])).toBe('en')
  })

  it('only looks at the most-preferred language', () => {
    expect(detectLocale(['en-US', 'es-ES'])).toBe('en')
    expect(detectLocale(['es-ES', 'en-US'])).toBe('es')
  })
})
