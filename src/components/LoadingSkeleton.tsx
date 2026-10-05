import type { FC } from 'react'

interface LoadingSkeletonProps {
  indicatorsCount?: number
}

/**
 * Squelette de chargement générique (titre + indicateurs + graphique), réutilisé par
 * DashboardPage et CountryDetailPage. Évite un écran vide pendant le chargement
 * (cahier des charges : "Loading : squelettes simples (boîtes grises) ou spinner").
 */
export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  indicatorsCount = 2,
}) => {
  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Chargement des données"
    >
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-8 sm:h-10 w-2/3 bg-gray-800 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: indicatorsCount }).map((_, index) => (
            <div key={index} className="h-24 bg-gray-800 rounded-lg" />
          ))}
        </div>
        <div className="h-64 sm:h-80 lg:h-[400px] bg-gray-800 rounded-lg" />
      </div>
    </div>
  )
}
