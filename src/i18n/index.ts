import { locale } from './detectLocale'
import { translations } from './translations'

export { locale } from './detectLocale'
export type { Locale } from './detectLocale'

/** The active translation strings — decided once at load time, no runtime switcher. */
export const t = translations[locale]
