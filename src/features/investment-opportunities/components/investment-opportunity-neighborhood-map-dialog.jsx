import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const FALLBACK_CENTER = { lat: 24.7136, lng: 46.6753 }
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script'

function parseCoordinate(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function loadGoogleMaps(apiKey, language) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps is only available in browser'))
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'))
  }

  const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID)
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => {
        resolve(window.google?.maps)
      })
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Google Maps script'))
      })
    })
  }

  const script = document.createElement('script')
  script.id = GOOGLE_MAPS_SCRIPT_ID
  script.async = true
  script.defer = true
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&language=${encodeURIComponent(language)}`

  return new Promise((resolve, reject) => {
    script.onload = () => resolve(window.google?.maps)
    script.onerror = () =>
      reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })
}

function extractNeighborhoodName(result) {
  const components = result?.address_components ?? []
  const preferredTypes = ['neighborhood', 'sublocality', 'route', 'locality']

  for (const type of preferredTypes) {
    const component = components.find((item) => item.types?.includes(type))
    if (component?.long_name) {
      return component.long_name
    }
  }

  return result?.formatted_address ?? ''
}

export function InvestmentOpportunityNeighborhoodMapDialog({
  open,
  onOpenChange,
  cities = [],
  selectedCityId = '',
  onSelectedCityIdChange,
  city,
  locale = 'ar',
  onConfirm,
}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const geocoderRef = useRef(null)
  const listenerRef = useRef(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const [mapError, setMapError] = useState('')

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  const selectedCity = useMemo(() => {
    if (selectedCityId) {
      const matchedCity = cities.find((cityItem) => cityItem.id === selectedCityId)
      if (matchedCity) {
        return matchedCity
      }
    }

    return city ?? null
  }, [cities, city, selectedCityId])
  const selectedCityName =
    locale === 'en'
      ? selectedCity?.name_en || selectedCity?.name_ar || ''
      : selectedCity?.name_ar || selectedCity?.name_en || ''
  const cityCenter = useMemo(
    () => ({
      lat: parseCoordinate(selectedCity?.latitude, FALLBACK_CENTER.lat),
      lng: parseCoordinate(selectedCity?.longitude, FALLBACK_CENTER.lng),
    }),
    [selectedCity?.latitude, selectedCity?.longitude],
  )

  useEffect(() => {
    if (!open || selectedCityId || !cities.length) {
      return
    }

    onSelectedCityIdChange?.(cities[0].id)
  }, [cities, onSelectedCityIdChange, open, selectedCityId])

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function setupMap() {
      setMapError('')
      setIsLoadingMap(true)
      setSelectedPoint(null)
      setSelectedNeighborhood('')

      try {
        const maps = await loadGoogleMaps(apiKey, locale === 'en' ? 'en' : 'ar')
        if (!maps || cancelled || !mapContainerRef.current) {
          return
        }

        const map = new maps.Map(mapContainerRef.current, {
          center: cityCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        mapRef.current = map
        geocoderRef.current = new maps.Geocoder()

        if (listenerRef.current) {
          maps.event.removeListener(listenerRef.current)
        }

        listenerRef.current = map.addListener('click', (event) => {
          const clicked = event?.latLng
          if (!clicked) {
            return
          }

          const lat = Number(clicked.lat().toFixed(6))
          const lng = Number(clicked.lng().toFixed(6))
          const coordinates = { lat, lng }
          setSelectedPoint(coordinates)

          if (!markerRef.current) {
            markerRef.current = new maps.Marker({
              position: coordinates,
              map,
            })
          } else {
            markerRef.current.setPosition(coordinates)
          }

          geocoderRef.current?.geocode(
            { location: coordinates },
            (results, status) => {
              if (status === 'OK' && Array.isArray(results) && results[0]) {
                setSelectedNeighborhood(extractNeighborhoodName(results[0]))
              } else {
                setSelectedNeighborhood('')
              }
            },
          )
        })
      } catch (error) {
        setMapError(error?.message || 'Failed to load map')
      } finally {
        if (!cancelled) {
          setIsLoadingMap(false)
        }
      }
    }

    void setupMap()

    return () => {
      cancelled = true
    }
  }, [apiKey, cityCenter, locale, open, selectedCityId])

  function handleConfirm() {
    if (!selectedPoint || !selectedNeighborhood || !selectedCity) {
      return
    }

    onConfirm?.({
      cityId: selectedCity.id,
      cityName: selectedCityName,
      neighborhood: selectedNeighborhood,
      latitude: selectedPoint.lat,
      longitude: selectedPoint.lng,
      locationText: `${selectedCityName}, ${selectedNeighborhood}`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[760px] p-0"
        dir={locale === 'en' ? 'ltr' : 'rtl'}
      >
        <DialogHeader className="border-b border-[#d6cbb2] px-6 pt-5 pb-4 text-start">
          <DialogTitle className="text-lg font-semibold text-[#181927]">
            {locale === 'ar'
              ? 'اختيار الحي من الخريطة'
              : 'Choose neighborhood from map'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6d4f3b]">
            {locale === 'ar'
              ? 'اختر نقطة من الخريطة لتحديد الحي والإحداثيات.'
              : 'Click a point on the map to capture neighborhood and coordinates.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2 text-start">
            <label
              htmlFor="neighborhood-map-city"
              className="text-sm leading-5 font-medium text-[#402f28]"
            >
              {locale === 'ar' ? 'المدينة' : 'City'}
            </label>
            <select
              id="neighborhood-map-city"
              value={selectedCityId}
              onChange={(event) => onSelectedCityIdChange?.(event.target.value)}
              className="h-12 w-full rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 text-sm leading-5 font-medium text-[#402f28] shadow-[var(--dashboard-shadow)] outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20"
            >
              {cities.map((cityOption) => (
                <option key={cityOption.id} value={cityOption.id}>
                  {locale === 'en'
                    ? cityOption.name_en || cityOption.name_ar
                    : cityOption.name_ar || cityOption.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-[#d6cbb2] bg-[#f8f3e8] p-2">
            <div
              ref={mapContainerRef}
              className="h-[360px] w-full rounded-lg bg-[#eae5d7]"
            />
          </div>

          {isLoadingMap ? (
            <p className="text-sm text-[#6d4f3b]">
              {locale === 'ar' ? 'جارٍ تحميل الخريطة...' : 'Loading map...'}
            </p>
          ) : null}

          {mapError ? (
            <p className="text-sm text-[#b93815]">
              {locale === 'ar'
                ? 'تعذر تحميل خرائط Google. تأكد من إعداد مفتاح API.'
                : 'Unable to load Google Maps. Check API key configuration.'}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] px-3 py-2 text-sm text-[#402f28]">
              <span className="font-medium">
                {locale === 'ar' ? 'الحي:' : 'Neighborhood:'}
              </span>{' '}
              <span>
                {selectedNeighborhood || (locale === 'ar' ? '-' : '-')}
              </span>
            </div>
            <div className="rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] px-3 py-2 text-sm text-[#402f28]">
              <span className="font-medium">
                {locale === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}
              </span>{' '}
              <span>
                {selectedPoint
                  ? `${selectedPoint.lat}, ${selectedPoint.lng}`
                  : '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedPoint || !selectedNeighborhood || !selectedCity}
            >
              {locale === 'ar' ? 'تأكيد الاختيار' : 'Confirm selection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
