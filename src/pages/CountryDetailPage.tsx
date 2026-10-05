import type { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { HeaderComponent } from '../components/HeaderComponent'
import { MedalsEvolutionChart } from '../components/MedalsEvolutionChart'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorMessage } from '../components/ErrorMessage'
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
    return <LoadingSkeleton indicatorsCount={3} />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const olympic = data?.find((o) => o.id === Number(id))

  if (!olympic) {
    return <ErrorMessage message="Aucun pays ne correspond à cet identifiant." />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-4 text-sm text-blue-400 underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
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

        <div className="text-sm text-gray-400 mt-4">
          <p>Données des 5 dernières éditions des Jeux Olympiques</p>
        </div>
      </div>
    </div>
  )
}
