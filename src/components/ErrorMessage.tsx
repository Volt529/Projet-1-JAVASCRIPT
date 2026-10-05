import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface ErrorMessageProps {
  message: string
  showBackLink?: boolean
}

/**
 * Message d'erreur/état vide générique, réutilisé par DashboardPage et CountryDetailPage.
 * Cahier des charges : "Error : message clair + bouton retour" — jamais de message technique brut.
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({
  message,
  showBackLink = true,
}) => (
  <div
    className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-4 text-center"
    role="alert"
  >
    <p className="text-lg text-red-400">{message}</p>
    {showBackLink && (
      <Link
        to="/"
        className="underline text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        ← Retour au dashboard
      </Link>
    )}
  </div>
)
