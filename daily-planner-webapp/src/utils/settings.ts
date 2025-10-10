export type Settings = {
  sound: boolean
  vibrate: boolean
  lang: string
}

const KEY = 'dp_settings_v1'

export const defaultSettings: Settings = { sound: true, vibrate: true, lang: 'en' }

export const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : defaultSettings
  } catch (e) {
    console.warn('loadSettings failed', e)
    return defaultSettings
  }
}

export const saveSettings = (s: Settings) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { console.warn('saveSettings failed', e) }
}
