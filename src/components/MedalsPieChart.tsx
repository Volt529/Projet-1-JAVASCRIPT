import type { FC } from 'react'
import { Pie } from 'react-chartjs-2'
import type { Olympic } from '../models/Olympic'
import { calculateTotalMedals } from '../utils/medals'

interface MedalsPieChartProps {
  data: Olympic[]
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
 * Composant "dumb" : ne fait qu'afficher un camembert à partir des données reçues en props.
 * Ne connaît pas l'origine des données (contrairement à l'ancien Home, cf. étape 1).
 */
export const MedalsPieChart: FC<MedalsPieChartProps> = ({ data }) => {
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
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
      <div style={{ height: '400px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
