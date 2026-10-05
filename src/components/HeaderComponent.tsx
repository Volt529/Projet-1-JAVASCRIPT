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
 */
export const HeaderComponent: FC<HeaderComponentProps> = ({
  title,
  subtitle,
  indicators,
}) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">{title}</h1>

      {subtitle && (
        <div className="mb-8">
          <p className="text-lg">{subtitle}</p>
        </div>
      )}

      <div className="mb-2">
        {indicators.map((indicator) => (
          <div
            key={indicator.label}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-2"
          >
            <h3 className="text-xl font-semibold mb-2">{indicator.label}</h3>
            <p className={`text-4xl font-bold ${indicator.color ?? 'text-blue-400'}`}>
              {indicator.value}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
