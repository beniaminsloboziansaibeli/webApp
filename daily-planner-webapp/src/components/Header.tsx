import React from 'react'
import { useTranslation } from 'react-i18next'
import { Share2, Expand, Settings as SettingsIcon } from 'lucide-react'

type HeaderProps = { name: string; onShare: () => void; streak?: number; onSettings?: () => void }

const Header: React.FC<HeaderProps> = ({ name, onShare, streak = 0, onSettings = () => {} }: HeaderProps) => {
  const { t } = useTranslation()
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('appTitle')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('greeting', { name })}</p>
        <div className="mt-1 text-sm text-green-600 font-medium">🔥 {streak} day streak</div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => { try { (window as any).WebApp?.expand?.() } catch {} }} title="Expand" className="p-2 rounded-lg bg-white border floating pulse-hover">
          <Expand size={16} />
        </button>
        <button onClick={onSettings} title="Settings" className="p-2 rounded-lg bg-white border floating pulse-hover">
          <SettingsIcon size={16} />
        </button>
        <button onClick={onShare} className="p-2 rounded-lg btn-primary floating pulse-hover">
          <Share2 size={18} />
        </button>
      </div>
    </header>
  )
}

export default Header
