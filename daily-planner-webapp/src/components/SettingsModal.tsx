import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, saveSettings } from '../utils/settings'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import { pop } from '../lib/motion'

const SettingsModal: React.FC<{ open: boolean; settings: Settings; onClose: (s?: Settings) => void }> = ({ open, settings, onClose }) => {
  const [draft, setDraft] = useState<Settings>(settings)
  const { t } = useTranslation()
  if (!open) return null

  const updateDraft = (patch: Partial<Settings>) => setDraft(prev => ({ ...prev, ...patch }))

  const handleSave = () => {
    saveSettings(draft)
    if (draft.lang) i18n.changeLanguage(draft.lang)
    if (draft.theme) document.documentElement.setAttribute('data-theme', draft.theme)
    onClose(draft)
  }

  const handleCancel = () => {
    // close without saving
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <motion.div initial="hidden" animate="visible" variants={pop} className="z-10 w-11/12 max-w-md card-glass p-4">
  <h3 className="font-semibold text-lg">{t('settings')}</h3>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>{t('sound')}</div>
            <input type="checkbox" checked={draft.sound} onChange={(e) => updateDraft({ sound: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Vibrate</div>
            <input type="checkbox" checked={draft.vibrate} onChange={(e) => updateDraft({ vibrate: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>{t('reducedMotion')}</div>
            <input type="checkbox" checked={draft.reducedMotion ?? false} onChange={(e) => updateDraft({ reducedMotion: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Volume</div>
            <input className="w-36" type="range" min="0" max="1" step="0.01" value={draft.volume ?? 0.12} onChange={(e) => updateDraft({ volume: Number(e.target.value) })} />
          </div>
          <div className="flex items-center justify-between">
            <div>{t('language')}</div>
            <select value={draft.lang} onChange={(e) => updateDraft({ lang: e.target.value })}>
              <option value="en">English</option>
              <option value="ro">Română</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>{t('theme')}</div>
            <select value={draft.theme ?? 'dark'} onChange={(e) => updateDraft({ theme: e.target.value as any })}>
              <option value="dark">{t('dark')}</option>
              <option value="light">{t('light')}</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>{t('username')}</div>
            <input value={draft.username ?? ''} onChange={(e) => updateDraft({ username: e.target.value })} className="ml-2 p-2 rounded bg-transparent border border-white/6" />
          </div>
        </div>
        <div className="mt-4 text-right flex items-center justify-end gap-2">
          <button onClick={handleCancel} className="px-4 py-2 btn-glass">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 btn-primary">Save</button>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsModal
