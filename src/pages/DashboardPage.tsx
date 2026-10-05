import type { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { HeaderComponent } from '../components/HeaderComponent'
import { MedalsPieChart } from '../components/MedalsPieChart'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorMessage } from '../components/ErrorMessage'

const TOTAL_GAMES_EDITIONS = 5

/**
 * Page "smart" : seule à appeler useData sur cette route.
 * Assemble HeaderComponent (titre + indicateurs) et MedalsPieChart (composants "dumb").
 */
export const DashboardPage: FC = () => {
  const { data, loading, error } = useData()
  const navigate = useNavigate()

  const handleCountryClick = (countryId: number): void => {
    navigate(`/country/${countryId}`)
  }

  if (loading) {
    return <LoadingSkeleton indicatorsCount={2} />
  }

  if (error) {
    return <ErrorMessage message={error} showBackLink={false} />
  }

  if (!data || data.length === 0) {
    return (
      <ErrorMessage message="Aucune donnée disponible." showBackLink={false} />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <HeaderComponent
          title="Historique des Jeux Olympiques - TéléSport"
          subtitle="Bienvenue sur la page dédiée à l'historique des Jeux Olympiques. Explorez les performances des pays au fil des années."
          indicators={[
            {
              label: 'Pays participants',
              value: data.length,
              color: 'text-blue-400',
            },
            {
              label: 'Éditions des JO',
              value: TOTAL_GAMES_EDITIONS,
              color: 'text-green-400',
            },
          ]}
        />

        <MedalsPieChart data={data} onCountryClick={handleCountryClick} />

        <nav
          aria-label="Liste des pays"
          className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {data.map((olympic) => (
            <Link
              key={olympic.id}
              to={`/country/${olympic.id}`}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Voir les détails de ${olympic.country}`}
            >
              {olympic.country}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-gray-400 mt-4">
          <p>Cliquez sur un pays pour voir ses détails</p>
        </div>
      </div>
    </div>
  )
}
