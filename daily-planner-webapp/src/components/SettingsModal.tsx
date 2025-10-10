import React from 'react'
import { motion } from 'framer-motion'
import { Settings, saveSettings } from '../utils/settings'
import i18n from 'i18next'
import { pop } from '../lib/motion'

const SettingsModal: React.FC<{ open: boolean; settings: Settings; onClose: (s?: Settings) => void }> = ({ open, settings, onClose }) => {
  if (!open) return null
  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch }
    saveSettings(next)
    if (patch.lang) i18n.changeLanguage(next.lang)
    onClose(next)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose()} />
      <motion.div initial="hidden" animate="visible" variants={pop} className="z-10 w-11/12 max-w-md card-glass p-4">
        <h3 className="font-semibold text-lg">Settings</h3>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>Sound</div>
            <input type="checkbox" checked={settings.sound} onChange={(e) => update({ sound: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Vibrate</div>
            <input type="checkbox" checked={settings.vibrate} onChange={(e) => update({ vibrate: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Reduced motion</div>
            <input type="checkbox" checked={settings.reducedMotion ?? false} onChange={(e) => update({ reducedMotion: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Volume</div>
            <input className="w-36" type="range" min="0" max="1" step="0.01" value={settings.volume ?? 0.12} onChange={(e) => update({ volume: Number(e.target.value) })} />
          </div>
          <div className="flex items-center justify-between">
            <div>Language</div>
            <select value={settings.lang} onChange={(e) => update({ lang: e.target.value })}>
              <option value="en">English</option>
              <option value="ro">Română</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button onClick={() => onClose()} className="px-4 py-2 mr-2 btn-glass">Close</button>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsModal
