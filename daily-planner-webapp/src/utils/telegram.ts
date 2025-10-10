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
    if (bg) {
      root.style.setProperty('--bg', bg)
      // simple luminance check: if bg is dark-ish, set data-theme='dark'
      const hex = bg.replace('#','')
      if (/^[0-9A-Fa-f]{6}$/.test(hex)){
        const r = parseInt(hex.substring(0,2),16)
        const g = parseInt(hex.substring(2,4),16)
        const b = parseInt(hex.substring(4,6),16)
        const luminance = (0.299*r + 0.587*g + 0.114*b)
        if (luminance < 90) root.setAttribute('data-theme','dark')
        else root.removeAttribute('data-theme')
      }
    }

    if (themeParams.secondary_bg_color) root.style.setProperty('--card', themeParams.secondary_bg_color)
    if (themeParams.text_color) root.style.setProperty('--muted', themeParams.hint_color || themeParams.text_color)
    if (themeParams.button_color) root.style.setProperty('--primary-start', themeParams.button_color)
    if (themeParams.button_text_color) root.style.setProperty('--primary-end', themeParams.button_text_color)
    // subtle glass tweak using hint_color alpha when available
    if (themeParams.hint_color) root.style.setProperty('--glass', themeParams.hint_color + '22')
  } catch (e) { console.warn('applyTelegramTheme failed', e) }
}
