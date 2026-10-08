# TéléSport — Olympic Games History Dashboard

Application web permettant de visualiser l'historique des performances des pays aux Jeux Olympiques : nombre de médailles par pays, et détail de l'évolution des performances d'un pays sélectionné.

Projet réalisé dans le cadre de la formation OpenClassrooms, à partir d'un starter code fourni, refactoré selon une architecture modulaire (voir [`ARCHITECTURE.md`](./ARCHITECTURE.md)) puis complété avec l'interface finale.

## 🚀 Fonctionnalités

- **Dashboard** : camembert du total des médailles par pays, avec indicateurs clés (pays participants, éditions des JO).
- **Page détail d'un pays** : indicateurs (participations, total médailles, total athlètes) et graphique d'évolution du nombre de médailles édition par édition.
- **Navigation SPA** : clic sur un segment du camembert (ou sur le nom d'un pays) → page détail, sans rechargement de page.
- **Gestion des erreurs** : page 404 pour toute URL inconnue, redirection automatique vers cette page si l'identifiant d'un pays dans l'URL ne correspond à rien.
- **Responsive** : mobile, tablette et desktop, avec un design adapté à chaque taille d'écran (voir captures ci-dessous).

## 📋 Prérequis

- **Node.js** 20 ou supérieur (testé avec Node 24 LTS)
- **npm** (inclus avec Node.js)

## 🛠️ Installation

```bash
git clone https://github.com/Volt529/Projet-1-JAVASCRIPT.git
cd Projet-1-JAVASCRIPT
npm install
```

## 🎯 Utilisation

### Serveur de développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
npm run build
```

### Linter

```bash
npm run lint
```

## 📁 Structure du projet

```
src/
├── models/           # Interfaces TypeScript (Participation, Olympic)
├── hooks/            # useData : seul point de contact avec la source de données
├── utils/            # Fonctions de calcul pures (totaux médailles/athlètes)
├── components/       # Composants réutilisables ("dumb") : HeaderComponent,
│                      # MedalsPieChart, MedalsEvolutionChart, LoadingSkeleton, ErrorMessage
├── pages/            # Pages ("smart") : DashboardPage, CountryDetailPage, NotFoundPage
├── App.tsx            # Configuration Chart.js + routing (React Router)
└── main.tsx           # Point d'entrée React
```

Le détail du raisonnement derrière cette organisation (séparation smart/dumb, choix des patterns, préparation à une future API) est documenté dans [`ARCHITECTURE.md`](./ARCHITECTURE.md). L'analyse du starter code d'origine et la proposition d'architecture sont dans [`notes-architecture.md`](./notes-architecture.md).

## 🔧 Choix techniques

- **React 19 + TypeScript**, en mode strict, sans `any`.
- **Vite** comme outil de build et serveur de développement.
- **Tailwind CSS 4** pour le style et la responsivité (breakpoints `sm`/`lg`), sans fichier CSS additionnel.
- **React Router 6** pour la navigation SPA (`/`, `/country/:id`, `/404`, route générique `*`).
- **Chart.js** (via `react-chartjs-2`) pour les graphiques, avec gestion du clic sur un segment pour la navigation.
- **Hook `useData` unique** : centralise la donnée (actuellement un tableau mocké) et un état `{ data, loading, error }`. C'est le seul fichier qui devra changer le jour où une vraie API REST sera branchée.
- **Composants réutilisables** (`HeaderComponent`, `LoadingSkeleton`, `ErrorMessage`) pour éviter toute duplication entre les deux pages.

## 📱 Captures d'écran

### Desktop

![Dashboard - Desktop](./screenshots/dashboard-desktop.png)
![Page détail - Desktop](./screenshots/country-desktop.png)

### Mobile

![Dashboard - Mobile](./screenshots/dashboard-mobile.png)
![Page détail - Mobile](./screenshots/country-mobile.png)

## ⚠️ Limites connues

- Les données sont actuellement mockées dans `useData.ts` (pas d'appel API réel), conformément au périmètre de cet exercice.
- Pas de tests automatisés (hors périmètre de cet exercice, voir `notes-architecture.md`).

## 📚 Documentation des technologies utilisées

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
