import React from 'react'
import { useTranslation } from 'react-i18next'

const Analytics: React.FC<{ tasksDone?: number; total?: number }> = ({ tasksDone = 0, total = 0 }) => {
  const { t } = useTranslation()
  const percent = total ? Math.round((tasksDone / total) * 100) : 0
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('analytics')}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="card-glass p-4">
          <div className="text-sm text-muted">{t('tasksDone')}</div>
          <div className="text-2xl font-bold mt-2">{tasksDone}/{total}</div>
        </div>
        <div className="card-glass p-4">
          <div className="text-sm text-muted">{t('completionRate')}</div>
          <div className="text-2xl font-bold mt-2">{percent}%</div>
        </div>
      </div>
      <div className="card-glass p-4">
        <div className="text-sm text-muted">{t('recentTrends')}</div>
        <div className="h-40 flex items-center justify-center text-muted">{t('chartPlaceholder')}</div>
      </div>
    </div>
  )
}

export default Analytics
