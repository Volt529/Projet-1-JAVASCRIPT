import { useState, useEffect, type FC } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
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
import { Pie, Line } from 'react-chartjs-2'

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

// Anti-pattern 1 — Données hardcodées dans le composant — idéalement : hook ou module séparé.
const olympicsData: any = [
  {
    id: 1,
    name: 'États-Unis',
    participations: [
      { id: 1, year: 2020, city: 'Tokyo', medalsCount: 113, athleteCount: 613 },
      { id: 2, year: 2016, city: 'Rio', medalsCount: 121, athleteCount: 555 },
      {
        id: 3,
        year: 2012,
        city: 'Londres',
        medalsCount: 104,
        athleteCount: 530,
      },
      { id: 4, year: 2008, city: 'Pékin', medalsCount: 112, athleteCount: 596 },
      {
        id: 5,
        year: 2004,
        city: 'Athènes',
        medalsCount: 101,
        athleteCount: 533,
      },
    ],
  },
  {
    id: 2,
    name: 'Chine',
    participations: [
      { id: 6, year: 2020, city: 'Tokyo', medalsCount: 88, athleteCount: 431 },
      { id: 7, year: 2016, city: 'Rio', medalsCount: 70, athleteCount: 413 },
      {
        id: 8,
        year: 2012,
        city: 'Londres',
        medalsCount: 88,
        athleteCount: 396,
      },
      { id: 9, year: 2008, city: 'Pékin', medalsCount: 100, athleteCount: 639 },
      {
        id: 10,
        year: 2004,
        city: 'Athènes',
        medalsCount: 63,
        athleteCount: 407,
      },
    ],
  },
  {
    id: 3,
    name: 'Japon',
    participations: [
      { id: 11, year: 2020, city: 'Tokyo', medalsCount: 58, athleteCount: 582 },
      { id: 12, year: 2016, city: 'Rio', medalsCount: 41, athleteCount: 338 },
      {
        id: 13,
        year: 2012,
        city: 'Londres',
        medalsCount: 38,
        athleteCount: 293,
      },
      { id: 14, year: 2008, city: 'Pékin', medalsCount: 25, athleteCount: 351 },
      {
        id: 15,
        year: 2004,
        city: 'Athènes',
        medalsCount: 37,
        athleteCount: 312,
      },
    ],
  },
  {
    id: 4,
    name: 'Grande-Bretagne',
    participations: [
      { id: 16, year: 2020, city: 'Tokyo', medalsCount: 65, athleteCount: 376 },
      { id: 17, year: 2016, city: 'Rio', medalsCount: 67, athleteCount: 366 },
      {
        id: 18,
        year: 2012,
        city: 'Londres',
        medalsCount: 65,
        athleteCount: 541,
      },
      { id: 19, year: 2008, city: 'Pékin', medalsCount: 51, athleteCount: 312 },
      {
        id: 20,
        year: 2004,
        city: 'Athènes',
        medalsCount: 30,
        athleteCount: 264,
      },
    ],
  },
  {
    id: 5,
    name: 'France',
    participations: [
      { id: 21, year: 2020, city: 'Tokyo', medalsCount: 33, athleteCount: 378 },
      { id: 22, year: 2016, city: 'Rio', medalsCount: 42, athleteCount: 401 },
      {
        id: 23,
        year: 2012,
        city: 'Londres',
        medalsCount: 34,
        athleteCount: 330,
      },
      { id: 24, year: 2008, city: 'Pékin', medalsCount: 41, athleteCount: 323 },
      {
        id: 25,
        year: 2004,
        city: 'Athènes',
        medalsCount: 33,
        athleteCount: 308,
      },
    ],
  },
]

// Anti-pattern 2 — Composant incohérent avec le nom du fichier (ex. Home dans App.tsx).
const Home: FC = () => {
  // Anti-pattern 3 — Utilisation de `any` — typer pour garder les bénéfices TypeScript.
  const [data, setData] = useState<any>(null)

  // Anti-pattern 4 — useEffect avec logique lourde dans le composant — idéalement : custom hook ou librairie de fetching de données (ex. react-query).
  // De plus en mode développement, le "strict mode" de React est activé, ce qui va éxecuter ce code 2
  // Pour aller plus loin : https://react.dev/learn/you-might-not-need-an-effect
  useEffect(() => {
    // Anti-pattern 5 — console.log à retirer.
    console.log('Loading data...')
    setTimeout(() => {
      setData(olympicsData)
      // Anti-pattern 5 — console.log à retirer.
      console.log('Data loaded:', olympicsData)
    }, 500)
  }, [])

  // Anti-pattern 6 — Logique métier complexe directement dans le composant
  const calculateTotalMedals = (country: any) => {
    return country.participations.reduce(
      (sum: any, p: any) => sum + p.medalsCount,
      0,
    )
  }

  const totalParticipatingCountries = data ? data.length : 0
  const totalGamesEditions = 5

  // Anti-pattern 7 — État de chargement dérivé des données au lieu d'un état dédié (loading/error).
  if (!data) {
    return <div>Chargement...</div>
  }

  const chartData = {
    labels: data.map((d: any) => d.name),
    datasets: [
      {
        label: 'Total des médailles',
        data: data.map((d: any) => calculateTotalMedals(d)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Historique des Jeux Olympiques - TéléSport
        </h1>

        <div className="mb-8">
          <p className="text-lg">
            Bienvenue sur la page dédiée à l'historique des Jeux Olympiques.
            Explorez les performances des pays au fil des années.
          </p>
        </div>

        {/* Anti-pattern 8 — Cartes dupliquées — extraire en composant réutilisable (Indicator.tsx). */}
        <div className="mb-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-2">
            <h3 className="text-xl font-semibold mb-2">Pays participants</h3>
            <p className="text-4xl font-bold text-blue-400">
              {totalParticipatingCountries}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Éditions des JO</h3>
            <p className="text-4xl font-bold text-green-400">
              {totalGamesEditions}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: '400px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>Cliquez sur un pays pour voir ses détails</p>
        </div>
      </div>
    </div>
  )
}

// Anti-pattern 9 — Plusieurs composants dans le même fichier — un fichier par composant recommandé.
// Composant non utilisé pour le moment, mais conservé pour la suite du projet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Country: FC = () => {
  const { id } = useParams()

  // Anti-pattern 5 — console.log à retirer.
  console.log('Loading country with id:', id)
  // Anti-pattern 3 — Utilisation de `any` pour l'état ne permettant pas de bénéficier de TypeScript.
  const country: any = olympicsData.find((c: any) => c.id === Number(id))

  // Anti-pattern 5 — console.log à retirer.
  console.log('Country loaded:', country)

  const totalMedals = country.participations.reduce(
    (sum: any, p: any) => sum + p.medalsCount,
    0,
  )
  const totalAthletes = country.participations.reduce(
    (sum: any, p: any) => sum + p.athleteCount,
    0,
  )
  const totalParticipations = country.participations.length

  // Anti-pattern 10 — Préparation des données du graphique dans le composant — extraire dans une fonction ou un hook pour séparer UI et logique. https://react.dev/learn/thinking-in-react
  const evolutionData = {
    labels: country.participations.map((p: any) => p.year.toString()),
    datasets: [
      {
        label: 'Nombre de médailles',
        data: country.participations.map((p: any) => p.medalsCount),
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
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{country.name}</h1>

        {/* Anti-pattern 8 — Cartes dupliquées avec Home — extraire en composant réutilisable (Indicator.tsx). */}
        <div className="mb-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-2">
            <h3 className="text-xl font-semibold mb-2">Participations</h3>
            <p className="text-4xl font-bold text-blue-400">
              {totalParticipations}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-2">
            <h3 className="text-xl font-semibold mb-2">Total médailles</h3>
            <p className="text-4xl font-bold text-yellow-400">{totalMedals}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total athlètes</h3>
            <p className="text-4xl font-bold text-green-400">{totalAthletes}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: '400px' }}>
            <Line data={evolutionData} options={evolutionOptions} />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>Données des 5 dernières éditions des Jeux Olympiques</p>
        </div>
      </div>
    </div>
  )
}

// Anti-pattern 11 — Routing dans App.tsx — idéalement : module dédié.
export const App: FC = () => {
  // Anti-pattern 5 — console.log à retirer.
  console.log('App rendered')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
