import type { FC, ReactNode } from 'react'

export interface Indicator {
  label: string
  value: string | number
  /** Classe Tailwind de couleur de texte, ex. "text-blue-400". */
  color?: string
}

interface HeaderComponentProps {
  title: string
  subtitle?: ReactNode
  indicators: Indicator[]
}

/**
 * Composant "dumb" réutilisable : titre de page + description optionnelle + liste d'indicateurs.
 * Remplace les cartes dupliquées entre Dashboard et page détail (anti-pattern 9 de l'étape 1).
 *
 * Responsive : les indicateurs passent de 1 colonne (mobile) à 2 (tablette) à 3 (desktop),
 * au lieu d'être toujours empilés sur toute la largeur.
 */
export const HeaderComponent: FC<HeaderComponentProps> = ({
  title,
  subtitle,
  indicators,
}) => {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">
        {title}
      </h1>

      {subtitle && (
        <div className="mb-6 lg:mb-8">
          <p className="text-base sm:text-lg">{subtitle}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {indicators.map((indicator) => (
          <div
            key={indicator.label}
            className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-base sm:text-xl font-semibold mb-2">
              {indicator.label}
            </h3>
            <p
              className={`text-3xl sm:text-4xl font-bold ${indicator.color ?? 'text-blue-400'}`}
            >
              {indicator.value}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
