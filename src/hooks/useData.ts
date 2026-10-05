import { useEffect, useState } from 'react'
import type { Olympic } from '../models/Olympic'

/**
 * Données mockées, en attendant une vraie API REST.
 * C'est le SEUL endroit du projet qui connaît la source des données :
 * le jour où une API existe, seul ce fichier changera (fetch au lieu du setTimeout ci-dessous),
 * sans rien modifier dans pages/ ou components/.
 */
const olympicsData: Olympic[] = [
  {
    id: 1,
    country: 'États-Unis',
    participations: [
      { id: 1, year: 2020, city: 'Tokyo', medalsCount: 113, athleteCount: 613 },
      { id: 2, year: 2016, city: 'Rio', medalsCount: 121, athleteCount: 555 },
      { id: 3, year: 2012, city: 'Londres', medalsCount: 104, athleteCount: 530 },
      { id: 4, year: 2008, city: 'Pékin', medalsCount: 112, athleteCount: 596 },
      { id: 5, year: 2004, city: 'Athènes', medalsCount: 101, athleteCount: 533 },
    ],
  },
  {
    id: 2,
    country: 'Chine',
    participations: [
      { id: 6, year: 2020, city: 'Tokyo', medalsCount: 88, athleteCount: 431 },
      { id: 7, year: 2016, city: 'Rio', medalsCount: 70, athleteCount: 413 },
      { id: 8, year: 2012, city: 'Londres', medalsCount: 88, athleteCount: 396 },
      { id: 9, year: 2008, city: 'Pékin', medalsCount: 100, athleteCount: 639 },
      { id: 10, year: 2004, city: 'Athènes', medalsCount: 63, athleteCount: 407 },
    ],
  },
  {
    id: 3,
    country: 'Japon',
    participations: [
      { id: 11, year: 2020, city: 'Tokyo', medalsCount: 58, athleteCount: 582 },
      { id: 12, year: 2016, city: 'Rio', medalsCount: 41, athleteCount: 338 },
      { id: 13, year: 2012, city: 'Londres', medalsCount: 38, athleteCount: 293 },
      { id: 14, year: 2008, city: 'Pékin', medalsCount: 25, athleteCount: 351 },
      { id: 15, year: 2004, city: 'Athènes', medalsCount: 37, athleteCount: 312 },
    ],
  },
  {
    id: 4,
    country: 'Grande-Bretagne',
    participations: [
      { id: 16, year: 2020, city: 'Tokyo', medalsCount: 65, athleteCount: 376 },
      { id: 17, year: 2016, city: 'Rio', medalsCount: 67, athleteCount: 366 },
      { id: 18, year: 2012, city: 'Londres', medalsCount: 65, athleteCount: 541 },
      { id: 19, year: 2008, city: 'Pékin', medalsCount: 51, athleteCount: 312 },
      { id: 20, year: 2004, city: 'Athènes', medalsCount: 30, athleteCount: 264 },
    ],
  },
  {
    id: 5,
    country: 'France',
    participations: [
      { id: 21, year: 2020, city: 'Tokyo', medalsCount: 33, athleteCount: 378 },
      { id: 22, year: 2016, city: 'Rio', medalsCount: 42, athleteCount: 401 },
      { id: 23, year: 2012, city: 'Londres', medalsCount: 34, athleteCount: 330 },
      { id: 24, year: 2008, city: 'Pékin', medalsCount: 41, athleteCount: 323 },
      { id: 25, year: 2004, city: 'Athènes', medalsCount: 33, athleteCount: 308 },
    ],
  },
]

interface UseDataResult {
  data: Olympic[] | null
  loading: boolean
  error: string | null
}

/**
 * Hook "smart" unique pour accéder aux données olympiques.
 * Gère un vrai état loading/error (au lieu d'un chargement dérivé de `data`, cf. étape 1).
 */
export const useData = (): UseDataResult => {
  const [data, setData] = useState<Olympic[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        setData(olympicsData)
      } catch {
        setError('Impossible de charger les données olympiques.')
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return { data, loading, error }
}
