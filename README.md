# InterviewLab

Plateforme d'entraînement aux entretiens techniques. Un recruteur IA pose des questions adaptées au poste et au niveau, relance quand la réponse est vague, puis génère un rapport détaillé : note globale, score par compétence, points forts, points à améliorer et conseils.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma** + **SQLite** en local (facile à passer sur PostgreSQL)
- **LLM** via n'importe quelle API compatible OpenAI (Groq gratuit, OpenAI, Mistral, Ollama…)

## Lancer le projet (Windows)

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent.

Dans le terminal de VS Code (`Ctrl+ù`), à la racine du projet :

```powershell
# 1. Installer les dépendances
npm install

# 2. Créer le fichier de configuration
copy .env.example .env
```

3. Ouvre `.env` et colle ta clé API dans `LLM_API_KEY`.
   Clé gratuite : crée un compte sur https://console.groq.com/keys

```powershell
# 4. Créer la base de données
npm run db:push

# 5. Lancer l'application
npm run dev
```

Ouvre ensuite http://localhost:3000

## Pages

| Route | Contenu |
|---|---|
| `/` | Page d'accueil (présentation, fonctionnalités, FAQ) |
| `/signup`, `/signin` | Création de compte et connexion |
| `/new` | Lancer un entretien (connexion requise) |
| `/interview/[id]` | Entretien en cours |
| `/report/[id]` | Rapport d'évaluation |
| `/history` | Historique de tes entretiens |

L'authentification est faite maison, sans dépendance : mots de passe hachés avec `scrypt`, session dans un cookie `httpOnly` signé en HMAC (`src/lib/auth.ts`). Ajoute `AUTH_SECRET` dans `.env`.

## Structure

```
prisma/schema.prisma              Modèles Interview, Message, Report
src/lib/llm.ts                    Client LLM (API compatible OpenAI)
src/lib/prompts.ts                Prompts du recruteur et de l'évaluateur
src/lib/interview.ts              Logique : question suivante, clôture, rapport
src/lib/roles.ts                  Postes, niveaux et thèmes couverts
src/app/api/interviews/...        Routes API (créer, répondre, terminer)
src/app/page.tsx                  Choix du poste et du niveau
src/app/interview/[id]/page.tsx   Écran d'entretien (chat)
src/app/report/[id]/page.tsx      Rapport d'évaluation
src/app/history/page.tsx          Historique des entretiens
```

## Deux modes

- **Poste type** : Data Scientist, ML Engineer, Data Engineer, Fullstack ou Backend.
- **À partir d'une offre** : colle la description du poste. Le recruteur IA identifie les exigences de l'offre et te questionne dessus ; le rapport évalue ton adéquation à ce poste.

## Fonctionnement

1. `POST /api/interviews` crée l'entretien et demande la première question au LLM.
2. `POST /api/interviews/:id/messages` enregistre la réponse et renvoie la question suivante. Le recruteur adapte la difficulté et relance si besoin.
3. Après la dernière question (ou avec « Terminer maintenant »), l'évaluateur analyse la transcription et renvoie un rapport JSON, enregistré en base.

## Feuille de route

- [x] Comptes utilisateurs (inscription, connexion, entretiens privés)
- [ ] Connexion Google / GitHub, mot de passe oublié
- [ ] Réponses en streaming
- [ ] Exercice de code en direct (Monaco Editor + exécution via Judge0)
- [x] Mode « à partir d'une offre » : entretien généré depuis une offre d'emploi collée
- [ ] Banque de questions en RAG (pgvector)
- [ ] Entretien vocal (Whisper + synthèse vocale)
- [ ] Tableau de progression dans le temps
- [ ] Passage à PostgreSQL, Docker, CI/CD GitHub Actions, déploiement Vercel
