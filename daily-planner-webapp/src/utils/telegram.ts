type TG = Window & { Telegram?: any; WebApp?: any }

const getTelegram = () => {
  const w = window as TG
  return w.Telegram || w.WebApp || (w as any).Telegram || (w as any).WebApp
}

export const initTelegram = () => {
  const tg = getTelegram()
  if (!tg || !tg.WebApp) return null
  try {
    tg.WebApp.ready()
    if (tg.WebApp.expand) tg.WebApp.expand()
    return tg.WebApp
  } catch (e) {
    console.warn('Telegram init failed', e)
    return null
  }
}

export const sendDataToBot = (data: any) => {
  const tg = getTelegram()
  try {
    if (tg && tg.WebApp && tg.WebApp.sendData) tg.WebApp.sendData(JSON.stringify(data))
  } catch (e) {
    console.warn('sendData failed', e)
  }
}

export const getUserInfo = () => {
  const tg = getTelegram()
  if (!tg || !tg.WebApp) return null
  return {
    id: tg.initDataUnsafe?.user?.id || tg.WebApp?.initDataUnsafe?.user?.id,
    name: tg.initDataUnsafe?.user?.first_name || tg.WebApp?.initDataUnsafe?.user?.first_name,
    lang: tg.initDataUnsafe?.user?.language_code || tg.WebApp?.initDataUnsafe?.user?.language_code,
    theme: tg.WebApp?.themeParams || {}
  }
}

export const applyTelegramTheme = (themeParams: any) => {
  if (!themeParams) return
  try {
    const root = document.documentElement

    // Telegram theme params example keys: bg_color, text_color, hint_color, button_color, button_text_color, secondary_bg_color
    // Decide light/dark based on bg luminance heuristic
    const bg = themeParams.bg_color || themeParams.page_bg_color || null
    // Only accept common hex formats (#RRGGBB or #RGB). If Telegram sends something unexpected, skip overriding --bg.
    const isHexColor = (c: string) => /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(c)
    if (bg && typeof bg === 'string' && isHexColor(bg)) {
      root.style.setProperty('--bg', bg)
      // simple luminance check: if bg is dark-ish, set data-theme='dark'
      const hex = bg.replace('#','')
      const normalized = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex
      if (/^[0-9A-Fa-f]{6}$/.test(normalized)){
        const r = parseInt(normalized.substring(0,2),16)
        const g = parseInt(normalized.substring(2,4),16)
        const b = parseInt(normalized.substring(4,6),16)
        const luminance = (0.299*r + 0.587*g + 0.114*b)
        if (luminance < 90) root.setAttribute('data-theme','dark')
        else root.removeAttribute('data-theme')
      }
    } else if (bg) {
      // If bg exists but is not a standard hex color, log it for diagnostics and skip overriding --bg
      // This prevents accidental application of unexpected values that could make the app look broken.
      // eslint-disable-next-line no-console
      console.warn('applyTelegramTheme: ignored unsupported bg color from Telegram:', bg)
    }

    if (themeParams.secondary_bg_color && typeof themeParams.secondary_bg_color === 'string' && isHexColor(themeParams.secondary_bg_color)) root.style.setProperty('--card', themeParams.secondary_bg_color)
    if (themeParams.text_color && typeof themeParams.text_color === 'string') root.style.setProperty('--muted', themeParams.hint_color || themeParams.text_color)
    if (themeParams.button_color && typeof themeParams.button_color === 'string') root.style.setProperty('--primary-start', themeParams.button_color)
    if (themeParams.button_text_color && typeof themeParams.button_text_color === 'string') root.style.setProperty('--primary-end', themeParams.button_text_color)
    // subtle glass tweak using hint_color alpha when available
    if (themeParams.hint_color && typeof themeParams.hint_color === 'string') root.style.setProperty('--glass', themeParams.hint_color + '22')
    // diagnostic log
    // eslint-disable-next-line no-console
    console.info('applyTelegramTheme: applied theme params (filtered).')
  } catch (e) { console.warn('applyTelegramTheme failed', e) }
}
