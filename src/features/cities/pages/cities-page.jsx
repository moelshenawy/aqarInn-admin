import { RefreshCcw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/shared/components/page-header'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { useDirection } from '@/lib/i18n/direction-provider'
import { useCitiesQuery } from '@/features/cities/hooks/use-cities-query'
import { useDeleteCityMutation } from '@/features/cities/hooks/use-delete-city-mutation'

export default function CitiesPage() {
  const { t } = useTranslation(['navigation'])
  const { dir } = useDirection()
  const { data, isLoading, isError, isFetching, refetch } = useCitiesQuery()
  const { mutate: deleteCity, isLoading: isDeleting } = useDeleteCityMutation()

  const cities = data?.data?.data ?? []

  function handleDeleteCity(city) {
    const confirmed = window.confirm(
      t('navigation.citiesPage.deleteCityConfirmDescription'),
    )

    if (!confirmed) {
      return
    }

    deleteCity(city.id, {
      onSuccess: () => {
        showDashboardSuccessToast({
          title: t('navigation.citiesPage.cityDeletedTitle'),
          description: t('navigation.citiesPage.cityDeletedDescription', {
            name: city.name_ar || city.name_en,
          }),
        })
      },
      onError: () => {
        showDashboardErrorToast({
          title: t('navigation.citiesPage.cityDeleteErrorTitle'),
          description: t('navigation.citiesPage.cityDeleteErrorDescription'),
        })
      },
    })
  }

  return (
    <div data-slot="cities-page-content" className="space-y-6" dir={dir}>
      <PageHeader
        titleKey="navigation.cities"
        descriptionKey="navigation.citiesPage.description"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            <RefreshCcw />
            {t('navigation.citiesPage.refresh')}
          </Button>
        }
      />

      <section className="overflow-hidden rounded-[32px] border border-[#d6cbb2] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]">
        <div className="border-b border-[#d6cbb2] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#181927]">
                {t('navigation.citiesPage.tableTitle')}
              </h2>
              <p className="mt-1 text-sm text-[#6d4f3b]">
                {t('navigation.citiesPage.tableSubtitle', {
                  count: cities.length,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {isLoading ? (
            <div className="rounded-[14px] border border-dashed border-[#d6cbb2] bg-white/70 p-10 text-center text-sm text-[#6d4f3b]">
              {t('navigation.citiesPage.loading')}
            </div>
          ) : cities.length > 0 ? (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.nameAr')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.nameEn')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.latitude')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.longitude')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.coverImage')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.createdAt')}
                  </TableHead>
                  <TableHead>
                    {t('navigation.citiesPage.table.columns.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>{city.name_ar || '-'}</TableCell>
                    <TableCell>{city.name_en || '-'}</TableCell>
                    <TableCell>{city.latitude || '-'}</TableCell>
                    <TableCell>{city.longitude || '-'}</TableCell>
                    <TableCell>
                      {city.cover_image_url ? (
                        <img
                          src={city.cover_image_url}
                          alt={city.name_ar || city.name_en || 'City cover'}
                          className="h-14 w-28 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-sm text-[#6d4f3b]">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {city.created_at
                        ? new Date(city.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCity(city)}
                          disabled={isDeleting}
                        >
                          <Trash2 />
                          {t('navigation.citiesPage.table.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[#d6cbb2] bg-white/60 px-6 py-10 text-center">
              <h3 className="text-base font-semibold text-[#181927]">
                {t('navigation.citiesPage.emptyTitle')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6d4f3b]">
                {t('navigation.citiesPage.emptyDescription')}
              </p>
            </div>
          )}
          {isError ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive mt-6 rounded-[14px] border p-4 text-sm">
              {t('navigation.citiesPage.errorMessage')}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
