import { gtag } from './base'
import { Category } from './types'

export function toggleDarkModeAnalytics(darkMode: boolean) {
  gtag('event', 'theme__toggle_mode', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Toggle dark/light mode',
    label: `${darkMode ? 'Dark' : 'Light'} mode`,
    themeMode: darkMode ? 'DARK' : 'LIGHT',
  })
}
