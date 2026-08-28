export type Locale = 'en' | 'es'

/**
 * Picks 'es' if the browser's most-preferred language is Spanish, 'en'
 * otherwise — including for anything else (French, Portuguese, no language
 * info at all), since English is the fallback. No user-facing switcher: this
 * runs once and is what the whole session uses.
 */
export function detectLocale(languages: readonly string[] = []): Locale {
  const primary = languages[0]
  if (primary && primary.toLowerCase().startsWith('es')) return 'es'
  return 'en'
}

function getBrowserLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') return []
  if (navigator.languages && navigator.languages.length > 0) return navigator.languages
  if (navigator.language) return [navigator.language]
  return []
}

export const locale: Locale = detectLocale(getBrowserLanguages())
