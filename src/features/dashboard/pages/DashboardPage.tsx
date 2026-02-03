import { useTranslation } from '@/shared/i18n'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{t('pages.dashboard.title')}</h1>
      <p className="text-sm sm:text-base text-muted-foreground">{t('pages.dashboard.subtitle')}</p>
    </div>
  )
}

