import { Category, sendEvent } from '../index'

export function toggleShowcaseAutoplayAnalytics(enable: boolean) {
  sendEvent('settings__showcase_autoplay', {
    category: Category.SHOWCASE_VIDEO,
    action: 'Toggle showcase autoplay',
    label: enable ? 'ENABLED' : 'DISABLED',
  })
}

export function pauseShowcaseVideoAnalytics() {
  sendEvent('settings__showcase_pause', {
    category: Category.SHOWCASE_VIDEO,
    action: 'Pause showcase video',
  })
}

export function playShowcaseVideoAnalytics() {
  sendEvent('settings__showcase_play', {
    category: Category.SHOWCASE_VIDEO,
    action: 'Play showcase video',
  })
}
