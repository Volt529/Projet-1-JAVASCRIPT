import type { FC } from 'react'
import { Line } from 'react-chartjs-2'
import type { Olympic } from '../models/Olympic'

interface MedalsEvolutionChartProps {
  olympic: Olympic
}

/**
 * Composant "dumb" : affiche l'évolution du nombre de médailles d'UN pays, édition par édition.
 */
export const MedalsEvolutionChart: FC<MedalsEvolutionChartProps> = ({
  olympic,
}) => {
  const evolutionData = {
    labels: olympic.participations.map((p) => p.year.toString()),
    datasets: [
      {
        label: 'Nombre de médailles',
        data: olympic.participations.map((p) => p.medalsCount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
    ],
  }

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl">
      <div className="h-64 sm:h-80 lg:h-[400px]">
        <Line data={evolutionData} options={evolutionOptions} />
      </div>
    </div>
  )
}
