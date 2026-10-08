import type { FC } from 'react'
import { Link } from 'react-router-dom'

/**
 * Page affichée pour toute URL inconnue (route générique "*") ou tout id de pays invalide
 * (CountryDetailPage y redirige via useNavigate). Jamais de message technique brut à l'utilisateur,
 * jamais d'écran vide (cahier des charges, étape 3).
 */
export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl sm:text-7xl font-bold text-blue-400">404</p>
      <h1 className="text-xl sm:text-2xl font-semibold">Page introuvable</h1>
      <p className="text-gray-400 max-w-md">
        La page que vous cherchez n'existe pas, ou le pays demandé n'est pas
        référencé.
      </p>
      <Link
        to="/"
        className="mt-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Retour au dashboard
      </Link>
    </div>
  )
}
