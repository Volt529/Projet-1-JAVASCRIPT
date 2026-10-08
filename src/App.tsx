import type { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js'
import { DashboardPage } from './pages/DashboardPage'
import { CountryDetailPage } from './pages/CountryDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
)

/**
 * App ne garde plus que la configuration Chart.js et le routing.
 * Toute la logique métier et l'affichage vivent désormais dans pages/, hooks/, components/.
 */
export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/country/:id" element={<CountryDetailPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
