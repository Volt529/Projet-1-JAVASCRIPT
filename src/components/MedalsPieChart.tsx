import type { FC } from 'react'
import { Pie } from 'react-chartjs-2'
import type { ActiveElement, ChartEvent } from 'chart.js'
import type { Olympic } from '../models/Olympic'
import { calculateTotalMedals } from '../utils/medals'

interface MedalsPieChartProps {
  data: Olympic[]
  /** Appelé avec l'id du pays cliqué sur un segment du camembert. */
  onCountryClick: (countryId: number) => void
}

const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
]

const BORDER_COLORS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
]

/**
 * Composant "dumb" : affiche un camembert et notifie le parent au clic sur un segment,
 * via onCountryClick. Ne connaît pas la route /country/:id ni useNavigate :
 * c'est DashboardPage (smart) qui décide quoi faire du clic.
 */
export const MedalsPieChart: FC<MedalsPieChartProps> = ({
  data,
  onCountryClick,
}) => {
  const chartData = {
    labels: data.map((olympic) => olympic.country),
    datasets: [
      {
        label: 'Total des médailles',
        data: data.map((olympic) => calculateTotalMedals(olympic)),
        backgroundColor: BACKGROUND_COLORS,
        borderColor: BORDER_COLORS,
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const country = data[index]
        onCountryClick(country.id)
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
        },
      },
    },
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl">
      <div
        className="h-64 sm:h-80 lg:h-[400px]"
        role="img"
        aria-label="Répartition du total des médailles par pays, toutes éditions confondues"
      >
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
