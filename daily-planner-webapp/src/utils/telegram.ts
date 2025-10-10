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
    // Example mapping; Telegram provides colors like bg_color, text_color
    if (themeParams.bg_color) root.style.setProperty('--bg', themeParams.bg_color)
    if (themeParams.button_color) root.style.setProperty('--primary-start', themeParams.button_color)
    if (themeParams.button_text_color) root.style.setProperty('--primary-end', themeParams.button_text_color)
  } catch (e) { console.warn('applyTelegramTheme failed', e) }
}
