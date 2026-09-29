# Notes d'architecture — TéléSport

## Étape 1 — Analyse du starter code

### Contexte du test
- `npm install` : OK, 223 paquets installés (17 vulnérabilités signalées par npm audit, à surveiller mais hors périmètre de cet exercice).
- `npm run dev` : l'application démarre et affiche le dashboard (camembert des médailles par pays + 2 cartes indicateurs).
- `npm run build` : **échoue**. Erreur TypeScript `'Country' is declared but its value is never read` → confirme que la page de détail par pays existe dans le code mais n'est reliée à aucune route. Le routeur ne déclare que `/`.
- `npm run lint` : **15 erreurs**, toutes du type `@typescript-eslint/no-explicit-any`.

Tout le code applicatif (données, logique, UI, routing) tient dans un seul fichier : `src/App.tsx` (381 lignes). C'est le premier signal d'alerte avant même de lire le contenu.

### Liste des problèmes identifiés

| # | Problème | Où (fichier / ligne) | Pourquoi c'est un problème | Mon commentaire |
|---|---|---|---|---|
| 1 | Un seul fichier `App.tsx` contient les données, 2 composants et le routing | `src/App.tsx` (tout le fichier) | Fichier "fourre-tout" : impossible à faire relire/reviewer facilement, conflits Git garantis dès qu'on est plusieurs à travailler dessus, aucune séparation des responsabilités | C'est le problème racine : presque tous les autres découlent de ce manque de découpage |
| 2 | Données `olympicsData` codées en dur dans le composant | `App.tsx` L28-144 | Mélange données/UI : impossible à remplacer facilement par un appel API plus tard sans toucher au composant | À extraire dans un module dédié (puis un hook au moment de simuler l'API) |
| 3 | Typage `any` généralisé (15 occurrences relevées par ESLint) | `App.tsx` L28, 149, 165, 167, 181, 185, 271, 277, 281, 288, 292... | On perd tout le bénéfice de TypeScript : aucune autocomplétion, aucune détection d'erreur à la compilation si la forme des données change | Il faut définir des interfaces (`Country`, `Participation`) et les réutiliser partout |
| 4 | Nom de composant incohérent avec le rôle : `Home` gère en fait tout le dashboard, mais son nom ne dit rien du contenu métier | `App.tsx` L147 | Rend la navigation dans le code difficile pour un nouveau développeur | Un nom plus explicite type `Dashboard` serait plus parlant |
| 5 | `useEffect` + `setTimeout` pour simuler un fetch, avec logique de chargement gérée à la main dans le composant | `App.tsx` L154-162 | Mélange effet de bord et logique de rendu ; en React 19 + StrictMode, l'effet s'exécute deux fois en dev, ce qui peut prêter à confusion si on ne le sait pas | À déplacer dans un hook custom (`useData`) qui encapsule ce détail d'implémentation |
| 6 | `console.log` oubliés en plusieurs endroits | `App.tsx` L156, L160, L269, L274, L371 | Pollue la console en production, fuite d'information potentielle, code non nettoyé | À supprimer avant tout commit "propre" |
| 7 | Logique métier (calculs) directement dans le JSX/corps du composant | `App.tsx` L165-170 (`calculateTotalMedals`), L276-284 (totaux médailles/athlètes) | Logique de calcul non réutilisable, non testable isolément, noyée dans le composant de présentation | À extraire en fonctions utilitaires pures (dans `models/` ou un fichier `utils`), voire dans le hook de données |
| 8 | État de chargement dérivé (`if (!data) return <div>Chargement...</div>`) au lieu d'un état dédié | `App.tsx` L149, L176-178 | Pas de distinction possible entre "en cours de chargement" et "erreur" ; fragile dès que la logique de données se complexifie | Prévoir un vrai état `{ data, loading, error }` dans le futur hook |
| 9 | Cartes indicateurs dupliquées entre `Home` et `Country` (même structure JSX répétée) | `App.tsx` L233-246 et L337-352 | Duplication de markup : toute modification de style/structure doit être répercutée à plusieurs endroits | À factoriser en composant réutilisable `Indicator` (props: label, valeur, couleur) |
| 10 | Deux composants (`Home` et `Country`) définis dans le même fichier | `App.tsx` L147 et L265 | Va à l'encontre de la convention "un composant = un fichier", rend le fichier encore plus long et difficile à naviguer | À séparer en `pages/Dashboard.tsx` et `pages/CountryDetail.tsx` (ou équivalent) |
| 11 | Préparation des données du graphique (`chartData`, `evolutionData`, `chartOptions`) directement dans les composants | `App.tsx` L180-216 et L287-329 | Mélange préparation de données et rendu ; rend le composant long à lire alors que ce n'est pas sa responsabilité première | À extraire dans des fonctions dédiées ou des composants "dumb" spécialisés (`MedalsPieChart`, `MedalsEvolutionChart`) |
| 12 | Routing défini directement dans `App.tsx`, avec une seule route enregistrée alors que la page détail existe | `App.tsx` L368-380 | Le composant `App` mélange configuration de routing et logique applicative ; la route manquante rend une fonctionnalité entière inaccessible | À isoler dans un module de routing dédié, et ajouter la route `/country/:id` manquante |
| 13 | Composant `Country` non branché, conservé avec un commentaire `eslint-disable-next-line` pour faire taire le linter | `App.tsx` L264 | Contourner le linter au lieu de corriger le problème (route manquante) cache un bug fonctionnel réel | Le vrai correctif est d'ajouter la route, pas de désactiver la règle |
| 14 | Aucune séparation "smart" (récupération/logique de données) vs "dumb" (affichage pur) | Tout `App.tsx` | Rend chaque composant à la fois responsable de la donnée et de l'affichage : impossible de réutiliser l'UI avec une autre source de données, difficile à tester | Le futur découpage doit clairement isoler les composants pages/hooks (smart) des composants de présentation (dumb) |

### Points positifs à noter
- Le projet est déjà en TypeScript, Vite, Tailwind CSS 4, React 19 avec React Router : la base technique est saine et à jour.
- Le README est clair et donne déjà une bonne idée du produit attendu.
- Les anti-patterns sont même annotés en commentaires dans le code (`// Anti-pattern X`), ce qui confirme qu'ils sont volontaires et pédagogiques — bon signal que j'ai bien tout repéré.

### Comportement visuel observé
- Le dashboard affiche correctement un camembert (Chart.js) des médailles totales par pays et deux cartes indicateurs (nb de pays participants, nb d'éditions).
- Aucun lien/bouton ne permet d'accéder à la page détail d'un pays : la fonctionnalité "clic sur un pays" mentionnée dans le texte (`Cliquez sur un pays pour voir ses détails`) n'est pas implémentée (pas de `<Link>`, pas de route).
- Après ~500ms (le `setTimeout` simulant le fetch), les données s'affichent normalement.
- Sur un écran desktop d'environ 1920 px, le contenu est centré dans un conteneur d'environ 1150 px et les deux cartes indicateurs sont **empilées verticalement**, chacune sur toute la largeur du conteneur, sans grille multi-colonnes. Le cahier des charges prévoit une grille à 12 colonnes dès 1200 px : le comportement responsive attendu n'est pas en place.
- Le camembert s'accompagne d'une légende (États-Unis, Chine, Japon, Grande-Bretagne, France).
- Le texte `Cliquez sur un pays pour voir ses détails` est affiché sous le graphique dans un gris discret sur fond sombre, alors qu'aucun clic ne mène nulle part : l'interface promet une interaction qui n'existe pas. Le contraste de ce texte est à vérifier avec un outil (le cahier des charges exige le niveau AA).

---

## Cahier des charges — synthèse (Spécifications TéléSport)

Après lecture des spécifications fournies par Jeannette, voici les points clés qui doivent guider la suite du projet :

### Deux pages attendues
- **Dashboard** (`/`, route par défaut) : contexte de l'app, pie/bar chart des médailles totales par pays, clic sur un pays → redirection vers sa page détail.
- **Page détail** (`/country/:id`) : KPI (participations, total médailles, total athlètes) + graphique ligne/aire de l'évolution des médailles par édition. Bouton retour vers `/`.

### Modèle de données imposé (à créer dans `src/models/`)
```ts
export interface Participation {
  id: number
  year: number
  city: string
  medalsCount: number
  athleteCount: number
}

export interface Olympic {
  id: number
  country: string
  participations: Participation[]
}
```
⚠️ Le champ s'appelle `country` dans le modèle officiel, alors que le starter code utilise `name`. À corriger lors du typage.

### Composants/fichiers nommés explicitement par le cahier des charges
- `HeaderComponent` — composant réutilisable : titre de page + itération sur une liste d'indicateurs (libellé + valeur). Remplace directement l'anti-pattern n°9 (cartes dupliquées) identifié plus haut.
- `DashboardPage` — page conteneur utilisant `HeaderComponent` + pie chart.
- `CountryDetailPage` — page conteneur utilisant `HeaderComponent` + graphique ligne/aire.
- `useData` — hook dans `src/hooks/useData.ts`, doit centraliser **toutes** les données (zéro tableau en dur dans les composants).

### Règles d'affichage et navigation
- Tri cohérent entre Dashboard et Détail (alphabétique ou par total).
- Clic sur un élément du graphique Dashboard → navigation vers `/country/:id`.
- Gestion d'un ID invalide saisi dans l'URL → message d'erreur clair (pas de crash).

### États à gérer explicitement (actuellement absents du starter)
- **Loading** : squelette ou spinner (le starter n'a qu'un texte "Chargement...").
- **Empty** : message "Aucune donnée".
- **Error** : message clair + bouton retour.

### Responsive (rien n'existe actuellement dans le starter)
- Desktop ≥ 1200px : 12 colonnes.
- Tablette 768–1199px : 8 colonnes, graphe pleine largeur.
- Mobile ≤ 767px : 4 colonnes, pile verticale.

### Accessibilité (absente du starter)
- Contrastes AA, focus visibles, `aria-label` sur boutons/icônes, description textuelle des graphiques.

### Contraintes non fonctionnelles
- Aucun `any` (15 occurrences actuellement, cf. tableau plus haut).
- Fichiers idéalement < 300 lignes (`App.tsx` actuel : 381 lignes à lui seul).
- Commits atomiques et messages clairs (`feat`, `fix`, `refactor`, `docs`).
- `README.md` doit documenter installation/structure/décisions ; `ARCHITECTURE.md` doit exister et être compréhensible.

### Gap analysis — état actuel vs attendu

| Exigence du cahier des charges | État dans le starter code |
|---|---|
| Route `/country/:id` fonctionnelle | ❌ Absente (`Country` déclaré mais jamais routé) |
| Gestion ID invalide | ❌ Aucune vérification, `country.find()` peut renvoyer `undefined` et faire planter le rendu |
| `HeaderComponent` réutilisable | ❌ Markup dupliqué entre `Home` et `Country` |
| `useData` centralisant les données | ❌ Données en dur + `useEffect`/`setTimeout` locaux dans `Home` |
| Modèle `Participation` / `Olympic` typé | ❌ Tout est `any`, champ `name` au lieu de `country` |
| États loading/empty/error distincts | ⚠️ Seul un loading basique existe (dérivé de `data`, pas un vrai état) ; empty et error absents |
| Responsive (breakpoints définis) | ❌ Pas de grille responsive définie, seulement des classes Tailwind de base |
| Accessibilité (aria, focus, contrastes) | ❌ Aucun `aria-label`, pas de description textuelle des graphiques |
| Fichiers < 300 lignes | ❌ `App.tsx` = 381 lignes à lui seul |
| Bouton retour sur page détail | ❌ Page détail non accessible donc rien à tester, mais le bouton n'existe pas dans le JSX actuel |
| `ARCHITECTURE.md` | ❌ N'existe pas encore (livrable de l'étape 4) |

Cette synthèse confirme et complète l'analyse de l'étape 1 : elle me donne surtout les **noms exacts** à utiliser dès l'étape 2 (`HeaderComponent`, `DashboardPage`, `CountryDetailPage`, `useData`, `Participation`, `Olympic`), ce qui évite d'inventer une nomenclature perso qui s'écarterait du cahier des charges.

---

## Étape 2 — Proposition de nouvelle architecture

### Arborescence proposée

```
src/
├── models/
│   ├── Participation.ts        # interface Participation
│   └── Olympic.ts               # interface Olympic
├── hooks/
│   └── useData.ts               # hook "smart" : centralise la donnée + l'état loading/error
├── components/
│   ├── HeaderComponent.tsx      # dumb : titre + liste d'indicateurs (remplace les cartes dupliquées)
│   ├── MedalsPieChart.tsx       # dumb : camembert des médailles par pays (Dashboard)
│   └── MedalsEvolutionChart.tsx # dumb : graphique ligne/aire de l'évolution (page détail)
├── pages/
│   ├── DashboardPage.tsx        # smart : appelle useData, assemble HeaderComponent + MedalsPieChart
│   └── CountryDetailPage.tsx    # smart : appelle useData, gère l'ID invalide, assemble HeaderComponent + MedalsEvolutionChart
├── utils/
│   └── medals.ts                # fonctions pures : calculateTotalMedals, calculateTotalAthletes...
├── App.tsx                      # ne garde que le <BrowserRouter> + <Routes>
└── main.tsx                     # inchangé (point d'entrée React)
```

Je garde tout sous `src/` directement (sans dossier `app/` intermédiaire) : le projet est petit, un niveau de dossier en moins suffit à rester lisible et évite de sur-complexifier, conformément à la recommandation de l'énoncé.

Le dossier `utils/` n'était pas dans la liste de base (`components/pages/hooks/models`), je l'ajoute pour un besoin précis : sortir les calculs (`calculateTotalMedals` etc., anti-pattern n°7 de l'étape 1) dans des fonctions pures, testables isolément et réutilisables entre `DashboardPage` et `CountryDetailPage`, plutôt que de les dupliquer ou de les cacher dans `useData`.

### Ce qui va où (mapping avec l'existant)

| Élément actuel (`App.tsx`) | Destination | Type |
|---|---|---|
| `olympicsData` (tableau en dur) | `hooks/useData.ts` | smart (source de données) |
| `interface`/`any` du starter | `models/Participation.ts`, `models/Olympic.ts` | typage partagé |
| `useEffect` + `setTimeout` + état loading dérivé | `hooks/useData.ts` (état `{ data, loading, error }`) | smart |
| Cartes indicateurs dupliquées (`Home` L233-246, `Country` L337-352) | `components/HeaderComponent.tsx` | dumb (props: titre, liste d'indicateurs) |
| `calculateTotalMedals`, totaux médailles/athlètes | `utils/medals.ts` | fonctions pures |
| Préparation `chartData`/`chartOptions` (camembert) | `components/MedalsPieChart.tsx` | dumb |
| Préparation `evolutionData` (ligne/aire) | `components/MedalsEvolutionChart.tsx` | dumb |
| Composant `Home` | `pages/DashboardPage.tsx` | smart |
| Composant `Country` (non branché) | `pages/CountryDetailPage.tsx` | smart, avec gestion d'un ID invalide |
| Routing (`<Routes>` dans `App.tsx`) | reste dans `App.tsx`, mais avec la route `/country/:id` ajoutée | — |

### Smart vs dumb : la règle que je fixe

- **Smart** (`pages/`, `hooks/`) : le seul endroit qui a le droit de connaître `useData` et donc l'origine des données. Aujourd'hui un tableau en dur, demain un vrai appel API : seul `useData.ts` changera.
- **Dumb** (`components/`) : ne reçoivent que des props déjà prêtes à afficher (`data`, `title`, `indicators`). Ils ne savent pas d'où viennent les données ni comment elles sont calculées. Ça les rend testables et réutilisables tels quels si l'appli évolue (ex. réutiliser `MedalsPieChart` ailleurs).

### Pourquoi ça prépare l'arrivée d'un vrai back-end

`useData.ts` devient le **seul point de contact** avec la source de données. Aujourd'hui il retourne le tableau statique ; le jour où les données viennent d'une API REST, seul ce fichier change (un `fetch` au lieu d'un `setTimeout`), avec la même forme de retour `{ data, loading, error }`. Aucun composant de `pages/` ou `components/` n'a à être modifié, exactement le découpage que demande le cahier des charges avec `useData`.

### Patterns retenus

- **Custom Hook pour la donnée** (`useData`) : isole l'effet de bord et l'état de chargement, un seul endroit à modifier plus tard pour brancher une vraie API.
- **Séparation component/hook (smart/dumb)** : logique d'un côté, affichage de l'autre — répond directement à l'anti-pattern n°14 de l'étape 1.
- **Composant réutilisable générique** (`HeaderComponent`) plutôt que du JSX dupliqué : répond à l'anti-pattern n°9.
- **Modèles typés partagés** (`models/`) : un seul endroit où `Participation`/`Olympic` sont définis, importés partout où c'est nécessaire, zéro `any`.
