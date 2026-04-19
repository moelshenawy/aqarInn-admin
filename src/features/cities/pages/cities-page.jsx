import { useMemo, useState } from 'react'
import { Edit3, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'
import { useDirection } from '@/lib/i18n/direction-provider'
import { useCitiesQuery } from '@/features/cities/hooks/use-cities-query'
import { useCreateCityMutation } from '@/features/cities/hooks/use-create-city-mutation'
import { useDeleteCityMutation } from '@/features/cities/hooks/use-delete-city-mutation'
import { useUpdateCityMutation } from '@/features/cities/hooks/use-update-city-mutation'

const EMPTY_CITY_FORM = {
  nameAr: '',
  nameEn: '',
  latitude: '',
  longitude: '',
}

export default function CitiesPage() {
  const { t } = useTranslation(['navigation'])
  const { dir } = useDirection()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCity, setEditingCity] = useState(null)
  const [pendingDeleteCity, setPendingDeleteCity] = useState(null)
  const [formValues, setFormValues] = useState(EMPTY_CITY_FORM)
  const [coverImageFile, setCoverImageFile] = useState(null)
  const { data, isLoading, isError, isFetching, refetch } = useCitiesQuery()
  const createCityMutation = useCreateCityMutation()
  const updateCityMutation = useUpdateCityMutation()
  const { mutate: deleteCity, isLoading: isDeleting } = useDeleteCityMutation()

  const cities = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
      ? data.data.data
      : []
  const isSubmitting =
    Boolean(createCityMutation.isLoading ?? createCityMutation.isPending) ||
    Boolean(updateCityMutation.isLoading ?? updateCityMutation.isPending)

  const dialogTitle = useMemo(
    () =>
      editingCity
        ? t('citiesPage.form.editTitle')
        : t('citiesPage.form.createTitle'),
    [editingCity, t],
  )

  const submitLabel = useMemo(
    () =>
      editingCity
        ? t('citiesPage.form.submitEdit')
        : t('citiesPage.form.submitCreate'),
    [editingCity, t],
  )

  function resetFormState() {
    setFormValues(EMPTY_CITY_FORM)
    setCoverImageFile(null)
    setEditingCity(null)
  }

  function openCreateDialog() {
    resetFormState()
    setIsFormOpen(true)
  }

  function openEditDialog(city) {
    setEditingCity(city)
    setFormValues({
      nameAr: city.name_ar ?? '',
      nameEn: city.name_en ?? '',
      latitude: city.latitude ?? '',
      longitude: city.longitude ?? '',
    })
    setCoverImageFile(null)
    setIsFormOpen(true)
  }

  function handleDialogOpenChange(nextOpen) {
    setIsFormOpen(nextOpen)

    if (!nextOpen) {
      resetFormState()
    }
  }

  function updateField(field, value) {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  function buildCityFormData() {
    const payload = new FormData()

    payload.append('name_ar', formValues.nameAr.trim())
    payload.append('name_en', formValues.nameEn.trim())
    payload.append('latitude', formValues.latitude.trim())
    payload.append('longitude', formValues.longitude.trim())

    if (coverImageFile) {
      payload.append('cover_image', coverImageFile)
    }

    return payload
  }

  function validateForm() {
    const requiredValues = [
      formValues.nameAr,
      formValues.nameEn,
      formValues.latitude,
      formValues.longitude,
    ]

    return requiredValues.every((value) => String(value).trim().length > 0)
  }

  function handleFormSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      showDashboardErrorToast({
        title: t('citiesPage.form.validationTitle'),
        description: t('citiesPage.form.validationDescription'),
      })
      return
    }

    const payload = buildCityFormData()
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    }

    if (editingCity) {
      updateCityMutation.mutate(
        { cityId: editingCity.id, payload, config },
        {
          onSuccess: () => {
            showDashboardSuccessToast({
              title: t('citiesPage.form.updateSuccessTitle'),
              description: t('citiesPage.form.updateSuccessDescription', {
                name: formValues.nameAr.trim(),
              }),
            })
            handleDialogOpenChange(false)
          },
          onError: () => {
            showDashboardErrorToast({
              title: t('citiesPage.form.updateErrorTitle'),
              description: t('citiesPage.form.updateErrorDescription'),
            })
          },
        },
      )

      return
    }

    createCityMutation.mutate(
      { payload, config },
      {
        onSuccess: () => {
          showDashboardSuccessToast({
            title: t('citiesPage.form.createSuccessTitle'),
            description: t('citiesPage.form.createSuccessDescription', {
              name: formValues.nameAr.trim(),
            }),
          })
          handleDialogOpenChange(false)
        },
        onError: () => {
          showDashboardErrorToast({
            title: t('citiesPage.form.createErrorTitle'),
            description: t('citiesPage.form.createErrorDescription'),
          })
        },
      },
    )
  }

  function handleDeleteCity(city) {
    if (!city) {
      return
    }

    setPendingDeleteCity(city)
  }

  function handleConfirmDeleteCity() {
    if (!pendingDeleteCity) {
      return
    }

    deleteCity(pendingDeleteCity.id, {
      onSuccess: () => {
        showDashboardSuccessToast({
          title: t('citiesPage.cityDeletedTitle'),
          description: t('citiesPage.cityDeletedDescription', {
            name: pendingDeleteCity.name_ar || pendingDeleteCity.name_en,
          }),
        })
        setPendingDeleteCity(null)
      },
      onError: () => {
        showDashboardErrorToast({
          title: t('citiesPage.cityDeleteErrorTitle'),
          description: t('citiesPage.cityDeleteErrorDescription'),
        })
        setPendingDeleteCity(null)
      },
    })
  }

  return (
    <div data-slot="cities-page-content" className="space-y-6" dir={dir}>
      {/* <PageHeader
        titleKey="cities"
        descriptionKey="citiesPage.description"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="d-flex h-8 px-3 leading-none whitespace-nowrap"
              onClick={openCreateDialog}
            >
              <Plus className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="d-flex h-8 px-3 leading-none whitespace-nowrap"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              <RefreshCcw className="size-4" />
            </Button>
          </div>
        }
      /> */}

      <section className="overflow-hidden rounded-[32px] border border-[#d6cbb2] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]">
        <div className="border-b border-[#d6cbb2] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#181927]">
                {t('citiesPage.tableTitle')}
              </h2>
              <p className="mt-1 text-sm text-[#6d4f3b]">
                {t('citiesPage.tableSubtitle', {
                  count: cities.length,
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="d-flex h-8 px-3 leading-none whitespace-nowrap"
                onClick={openCreateDialog}
              >
                <Plus className="size-4" />
                {/* {t('citiesPage.form.openCreate')} */}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="d-flex h-8 px-3 leading-none whitespace-nowrap"
                onClick={() => refetch()}
                disabled={isLoading || isFetching}
              >
                <RefreshCcw className="size-4" />
                {/* {t('citiesPage.refresh')} */}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {isLoading ? (
            <div className="rounded-[14px] border border-dashed border-[#d6cbb2] bg-white/70 p-10 text-center text-sm text-[#6d4f3b]">
              {t('citiesPage.loading')}
            </div>
          ) : cities.length > 0 ? (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('citiesPage.table.columns.nameAr')}</TableHead>
                  <TableHead>{t('citiesPage.table.columns.nameEn')}</TableHead>
                  <TableHead>
                    {t('citiesPage.table.columns.latitude')}
                  </TableHead>
                  <TableHead>
                    {t('citiesPage.table.columns.longitude')}
                  </TableHead>
                  <TableHead>
                    {t('citiesPage.table.columns.coverImage')}
                  </TableHead>
                  <TableHead>
                    {t('citiesPage.table.columns.createdAt')}
                  </TableHead>
                  <TableHead>{t('citiesPage.table.columns.actions')}</TableHead>
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
                      {city.cover_image_absolute_url || city.cover_image_url ? (
                        <img
                          src={
                            city.cover_image_absolute_url ||
                            city.cover_image_url
                          }
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
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 leading-none whitespace-nowrap"
                          onClick={() => openEditDialog(city)}
                          disabled={isSubmitting}
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        {/*
                        Hide Delete button
                         <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-3 leading-none whitespace-nowrap"
                          onClick={() => handleDeleteCity(city)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="size-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[#d6cbb2] bg-white/60 px-6 py-10 text-center">
              <h3 className="text-base font-semibold text-[#181927]">
                {t('citiesPage.emptyTitle')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6d4f3b]">
                {t('citiesPage.emptyDescription')}
              </p>
            </div>
          )}
          {isError ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive mt-6 rounded-[14px] border p-4 text-sm">
              {t('citiesPage.errorMessage')}
            </div>
          ) : null}
        </div>
      </section>

      <Dialog open={isFormOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="max-w-2xl rounded-[24px] border border-[#d6cbb2] bg-[#f8f3e8] p-0"
          dir={dir}
        >
          <DialogHeader className="border-b border-[#d6cbb2] px-6 py-5 text-start">
            <DialogTitle className="text-lg font-semibold text-[#181927]">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-[#6d4f3b]">
              {t('citiesPage.form.description')}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 px-6 py-6" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city-name-ar">
                  {t('citiesPage.form.fields.nameAr')}
                </Label>
                <Input
                  id="city-name-ar"
                  value={formValues.nameAr}
                  onChange={(event) =>
                    updateField('nameAr', event.currentTarget.value)
                  }
                  placeholder={t('citiesPage.form.placeholders.nameAr')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city-name-en">
                  {t('citiesPage.form.fields.nameEn')}
                </Label>
                <Input
                  id="city-name-en"
                  value={formValues.nameEn}
                  onChange={(event) =>
                    updateField('nameEn', event.currentTarget.value)
                  }
                  placeholder={t('citiesPage.form.placeholders.nameEn')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city-latitude">
                  {t('citiesPage.form.fields.latitude')}
                </Label>
                <Input
                  id="city-latitude"
                  value={formValues.latitude}
                  onChange={(event) =>
                    updateField('latitude', event.currentTarget.value)
                  }
                  placeholder={t('citiesPage.form.placeholders.latitude')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city-longitude">
                  {t('citiesPage.form.fields.longitude')}
                </Label>
                <Input
                  id="city-longitude"
                  value={formValues.longitude}
                  onChange={(event) =>
                    updateField('longitude', event.currentTarget.value)
                  }
                  placeholder={t('citiesPage.form.placeholders.longitude')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city-cover-image">
                {t('citiesPage.form.fields.coverImage')}
              </Label>
              <Input
                id="city-cover-image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setCoverImageFile(event.currentTarget.files?.[0] ?? null)
                }
              />
              {(editingCity?.cover_image_absolute_url ||
                editingCity?.cover_image_url) &&
              !coverImageFile ? (
                <img
                  src={
                    editingCity.cover_image_absolute_url ||
                    editingCity.cover_image_url
                  }
                  alt={
                    editingCity.name_ar || editingCity.name_en || 'City cover'
                  }
                  className="mt-2 h-20 w-36 rounded-lg object-cover"
                />
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isSubmitting}
              >
                {t('citiesPage.form.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(pendingDeleteCity)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPendingDeleteCity(null)
          }
        }}
        title={t('citiesPage.deleteCityConfirmTitle')}
        description={t('citiesPage.deleteCityConfirmDescription')}
        confirmLabel={t('citiesPage.deleteCityConfirmConfirm')}
        cancelLabel={t('citiesPage.deleteCityConfirmCancel')}
        closeLabel={t('citiesPage.deleteCityConfirmClose')}
        confirmVariant="destructive"
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        dir={dir}
        onConfirm={handleConfirmDeleteCity}
      />
    </div>
  )
}
