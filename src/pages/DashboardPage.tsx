import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { HeaderComponent } from '../components/HeaderComponent'
import { MedalsPieChart } from '../components/MedalsPieChart'

const TOTAL_GAMES_EDITIONS = 5

/**
 * Page "smart" : seule à appeler useData sur cette route.
 * Assemble HeaderComponent (titre + indicateurs) et MedalsPieChart (composants "dumb").
 */
export const DashboardPage: FC = () => {
  const { data, loading, error } = useData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <p className="text-lg">Chargement des données...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <p className="text-lg">Aucune donnée disponible.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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

        <MedalsPieChart data={data} />

        <div className="mt-4 flex flex-wrap gap-3">
          {data.map((olympic) => (
            <Link
              key={olympic.id}
              to={`/country/${olympic.id}`}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {olympic.country}
            </Link>
          ))}
        </div>

        <div className="text-sm text-gray-400 mt-4">
          <p>Cliquez sur un pays pour voir ses détails</p>
        </div>
      </div>
    </div>
  )
}
