import type { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { HeaderComponent } from '../components/HeaderComponent'
import { MedalsEvolutionChart } from '../components/MedalsEvolutionChart'
import {
  calculateTotalAthletes,
  calculateTotalMedals,
  calculateTotalParticipations,
} from '../utils/medals'

/**
 * Page "smart" : appelle useData, résout le pays à partir de l'id de l'URL,
 * et gère explicitement le cas d'un id invalide (critère du cahier des charges).
 */
export const CountryDetailPage: FC = () => {
  const { id } = useParams()
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

  const olympic = data?.find((o) => o.id === Number(id))

  if (!olympic) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-400">
          Aucun pays ne correspond à cet identifiant.
        </p>
        <Link to="/" className="underline text-blue-400">
          ← Retour au dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-4 text-sm text-blue-400 underline"
        >
          ← Retour au dashboard
        </Link>

        <HeaderComponent
          title={olympic.country}
          indicators={[
            {
              label: 'Participations',
              value: calculateTotalParticipations(olympic),
              color: 'text-blue-400',
            },
            {
              label: 'Total médailles',
              value: calculateTotalMedals(olympic),
              color: 'text-yellow-400',
            },
            {
              label: 'Total athlètes',
              value: calculateTotalAthletes(olympic),
              color: 'text-green-400',
            },
          ]}
        />

        <MedalsEvolutionChart olympic={olympic} />

        <div className="text-sm text-gray-400">
          <p>Données des 5 dernières éditions des Jeux Olympiques</p>
        </div>
      </div>
    </div>
  )
}
