export type LevelId = "stage" | "junior" | "confirme";

type RoleInfo = { label: string; topics: string[] };

/** Postes types, regroupés par famille pour l'affichage. */
const PRESETS = {
  "Data & IA": {
    "data-scientist": {
      label: "Data Scientist",
      topics: [
        "statistiques et probabilités",
        "préparation et nettoyage des données (pandas)",
        "modèles supervisés et non supervisés",
        "métriques d'évaluation et validation croisée",
        "surapprentissage et régularisation",
        "SQL",
      ],
    },
    "data-analyst": {
      label: "Data Analyst",
      topics: [
        "SQL (jointures, agrégations, fonctions de fenêtrage)",
        "analyse exploratoire avec pandas ou Excel",
        "KPI et indicateurs métier",
        "data visualisation et dashboards (Power BI, Tableau)",
        "statistiques descriptives et tests A/B",
        "restitution des résultats à des équipes non techniques",
      ],
    },
    "ml-engineer": {
      label: "ML Engineer",
      topics: [
        "entraînement et déploiement de modèles",
        "MLOps (MLflow, CI/CD, monitoring, dérive des données)",
        "deep learning (PyTorch / TensorFlow)",
        "APIs de serving (FastAPI) et Docker",
        "optimisation des performances d'inférence",
      ],
    },
    "ai-engineer": {
      label: "AI Engineer (IA générative)",
      topics: [
        "fonctionnement des LLM (tokens, embeddings, contexte)",
        "prompt engineering et sorties structurées",
        "RAG : découpage, bases vectorielles, recherche hybride",
        "agents et appel d'outils (function calling)",
        "évaluation des LLM et réduction des hallucinations",
        "coût, latence et sécurité (prompt injection)",
      ],
    },
    "data-engineer": {
      label: "Data Engineer",
      topics: [
        "SQL avancé et modélisation de données",
        "pipelines ETL/ELT et orchestration (Airflow)",
        "traitement batch vs streaming (Spark, Kafka)",
        "qualité et gouvernance des données",
        "cloud et entrepôts de données",
      ],
    },
    "computer-vision": {
      label: "Ingénieur Computer Vision",
      topics: [
        "réseaux convolutifs et vision transformers",
        "classification, détection (YOLO) et segmentation",
        "augmentation de données et transfer learning",
        "métriques (IoU, mAP)",
        "déploiement de modèles de vision",
      ],
    },
    "nlp-engineer": {
      label: "Ingénieur NLP",
      topics: [
        "prétraitement du texte et tokenisation",
        "embeddings et transformers (BERT, etc.)",
        "classification de texte et NER",
        "fine-tuning et Hugging Face",
        "évaluation des modèles de langage",
      ],
    },
    "data-audit": {
      label: "Data Scientist Audit / Finance",
      topics: [
        "analyse de données comptables et financières",
        "détection d'anomalies et de fraudes",
        "SQL et Python (pandas) sur de gros volumes",
        "explicabilité des modèles (SHAP)",
        "qualité des données et traçabilité",
        "automatisation des contrôles",
      ],
    },
  },
  "Développement": {
    fullstack: {
      label: "Développeur Fullstack",
      topics: [
        "JavaScript / TypeScript",
        "React et Next.js (rendu serveur, état, hooks)",
        "conception d'API REST",
        "bases de données SQL et NoSQL",
        "authentification et sécurité web",
        "tests et CI/CD",
      ],
    },
    frontend: {
      label: "Développeur Frontend",
      topics: [
        "JavaScript / TypeScript (closures, asynchrone, event loop)",
        "React (hooks, gestion d'état, performances)",
        "HTML, CSS et responsive design",
        "accessibilité",
        "tests front (Jest, Testing Library, Playwright)",
      ],
    },
    backend: {
      label: "Développeur Backend",
      topics: [
        "conception d'API et architecture",
        "bases de données, index et transactions",
        "performance, cache et scalabilité",
        "sécurité",
        "tests et Docker",
      ],
    },
    "java-spring": {
      label: "Développeur Java / Spring",
      topics: [
        "Java (POO, collections, streams, concurrence)",
        "Spring Boot (injection de dépendances, REST)",
        "JPA / Hibernate et bases de données",
        "tests (JUnit, Mockito)",
        "microservices",
      ],
    },
    "python-dev": {
      label: "Développeur Python",
      topics: [
        "Python avancé (générateurs, décorateurs, typage)",
        "FastAPI ou Django",
        "bases de données et ORM",
        "tests (pytest)",
        "packaging et bonnes pratiques",
      ],
    },
    mobile: {
      label: "Développeur Mobile",
      topics: [
        "React Native ou Flutter",
        "cycle de vie et navigation",
        "gestion d'état et stockage local",
        "appels API et mode hors ligne",
        "performances et publication sur les stores",
      ],
    },
  },
  "Infra, cloud & qualité": {
    devops: {
      label: "DevOps / Cloud",
      topics: [
        "Linux et scripting (Bash)",
        "Docker et Kubernetes",
        "CI/CD (GitHub Actions, GitLab CI)",
        "cloud (AWS, Azure ou GCP)",
        "infrastructure as code (Terraform)",
        "monitoring et observabilité",
      ],
    },
    cybersecurity: {
      label: "Cybersécurité",
      topics: [
        "vulnérabilités web (OWASP Top 10)",
        "réseaux et protocoles",
        "authentification, chiffrement et gestion des secrets",
        "analyse de logs et réponse à incident",
        "sécurité du cloud",
      ],
    },
    qa: {
      label: "QA / Ingénieur Test",
      topics: [
        "stratégie de test (unitaire, intégration, end-to-end)",
        "automatisation (Playwright, Cypress, Selenium)",
        "tests d'API",
        "intégration des tests dans la CI",
        "rédaction de cas de test et suivi des anomalies",
      ],
    },
  },
} as const satisfies Record<string, Record<string, RoleInfo>>;

type PresetRoleId = {
  [Group in keyof typeof PRESETS]: keyof (typeof PRESETS)[Group];
}[keyof typeof PRESETS];

export type RoleId = PresetRoleId | "offre";

/** Groupes de postes types pour le formulaire. */
export const ROLE_GROUPS = Object.entries(PRESETS).map(([title, roles]) => ({
  title,
  roles: Object.keys(roles) as PresetRoleId[],
}));

export const ROLES = {
  ...Object.assign({}, ...Object.values(PRESETS)),
  offre: {
    label: "Offre personnalisée",
    topics: ["les exigences techniques de l'offre fournie"],
  },
} as Record<RoleId, { label: string; topics: readonly string[] }>;

/** Libellé à afficher pour un entretien (intitulé de l'offre ou poste type). */
export function interviewLabel(interview: { role: string; jobTitle: string | null }): string {
  if (interview.jobTitle) return interview.jobTitle;
  return isRoleId(interview.role) ? ROLES[interview.role].label : interview.role;
}

export const LEVELS: Record<LevelId, string> = {
  stage: "Stage / Alternance",
  junior: "Junior (0-2 ans)",
  confirme: "Confirmé (3-5 ans)",
};

export function isRoleId(value: unknown): value is RoleId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(ROLES, value);
}

export function isLevelId(value: unknown): value is LevelId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LEVELS, value);
}
