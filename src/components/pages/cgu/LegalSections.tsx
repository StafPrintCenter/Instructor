import { SITE } from "@/data/site";
import type { LegalSection } from "@/components/site/LegalDocShell";

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "statut",
    title: "Statut et gouvernance",
    summary: "Vous intervenez sur les formations que l'administration vous assigne.",
    intro: `La présente charte définit le cadre dans lequel le formateur collabore avec ${SITE.name}, dont l'activité est ${SITE.activity.toLowerCase()} et qui est aussi un centre de formation implanté à ${SITE.city}. Elle s'applique à tout compte formateur actif sur la plateforme, du premier accès jusqu'à la fin de la collaboration.`,
    clauses: [
      {
        label: "Périmètre d'intervention",
        text: "Le formateur conçoit et anime les formations qui lui sont assignées par l'administration. Il n'ouvre pas de formation de sa propre initiative et n'intervient pas sur une formation qui ne lui est pas confiée.",
      },
      {
        label: "Création et tarification réservées",
        text: "La création globale des formations (existence, intitulé, catalogue, niveau, durée, prérequis) ainsi que leur tarification sont réservées à l'administrateur. Le formateur ne peut ni publier, ni modifier, ni supprimer une formation, ni en changer le prix.",
      },
      {
        label: "Contenus pédagogiques",
        text: "Le formateur gère les modules, les leçons, les ressources et les quiz des formations assignées. Il organise la progression pédagogique et choisit les supports qu'il juge adaptés au niveau du groupe.",
      },
      {
        label: "Validation préalable",
        text: "Tout contenu mis en ligne est soumis à la validation de l'administration. Il ne devient visible des apprenants qu'après approbation ; en cas de retour pour correction, le formateur ajuste puis représente le contenu en validation.",
      },
      {
        label: "Cadre contractuel",
        text: "Les modalités financières et le statut du formateur (rémunération, volume, durée) sont fixés dans l'accord individuel signé avec le centre. La présente charte en constitue le volet pédagogique et déontologique.",
      },
    ],
  },
  {
    id: "propriete",
    title: "Propriété et droits sur les contenus pédagogiques",
    summary: "Vous restez l'auteur ; le centre obtient la licence nécessaire pour diffuser.",
    intro: `Les supports, exercices, études de cas, quiz et ressources élaborés dans ${SITE.tool} sont produits pour les besoins des formations du centre.`,
    clauses: [
      {
        label: "Licence d'exploitation",
        text: `Le formateur accorde à ${SITE.name} une licence non exclusive, gratuite, mondiale et consentie pour la durée d'exploitation de la plateforme, aux fins de reproduction, diffusion, adaptation (mise à jour, reformulation, traduction, découpage en modules) et d'intégration aux cursus du centre.`,
      },
      {
        label: "Paternité",
        text: "Le formateur conserve la qualité d'auteur et est mentionné sur les contenus qu'il produit, sauf demande contraire de sa part.",
      },
      {
        label: "Garantie de non-contrefaçon",
        text: "Le formateur garantit détenir les droits sur les contenus qu'il soumet et qu'il n'est porté atteinte à aucun droit de tiers : droit d'auteur, marque, droit à l'image, secret des affaires.",
      },
      {
        label: "Ressources libres de droits",
        text: "Les images, polices, icônes, fichiers audio, maquettes et cas clients intégrés aux leçons doivent être libres de droits, placés sous une licence compatible, ou appartenir au centre. Les captures d'écran d'outils tiers sont réalisées à partir de comptes ou de licences autorisés.",
      },
      {
        label: "Documents sensibles",
        text: "Il est interdit d'intégrer des supports, fichiers clients ou méthodes issus d'un employeur ou d'un client précédent sans autorisation écrite préalable.",
      },
      {
        label: "Après la collaboration",
        text: "À la fin de la collaboration, la licence consentie se poursuit pour les contenus déjà publiés ; le centre peut les mettre à jour ou les retirer. Le formateur peut demander le retrait d'un contenu qu'il ne souhaite plus voir diffusé sous son nom, sans que cela n'affecte les apprenants déjà inscrits.",
      },
    ],
  },
  {
    id: "confidentialite",
    title: "Confidentialité et protection des apprenants",
    summary: "Les données des apprenants ne sortent jamais de la plateforme.",
    intro: `L'accès à ${SITE.tool} donne accès à des informations personnelles : identité et contacts des apprenants, travaux rendus, notes, présences et échanges.`,
    clauses: [
      {
        label: "Confidentialité stricte",
        text: "Ces informations sont strictement confidentielles et ne peuvent être utilisées que pour la mission pédagogique en cours.",
      },
      {
        label: "Interdiction d'usage externe",
        text: "Aucune donnée personnelle, aucun travail rendu ni aucune note ne peut être copié, exporté, photographié, stocké sur un compte ou un appareil personnel, ou communiqué en dehors de la plateforme, à quelque fin que ce soit : prospection, portfolio, référence client ou publication.",
      },
      {
        label: "Canaux officiels",
        text: "Les échanges avec les apprenants se déroulent exclusivement sur les canaux officiels de la plateforme : communauté, messagerie interne et sessions programmées. Il est interdit de collecter ou d'utiliser des adresses personnelles, des numéros privés ou des groupes de messagerie hors plateforme.",
      },
      {
        label: "Compte nominatif",
        text: "Les identifiants sont personnels et ne sont communiqués à personne. Le formateur verrouille son poste de travail et signale sans délai toute connexion ou accès anormal à son compte.",
      },
      {
        label: "Protection des données",
        text: "Le formateur respecte la réglementation applicable au Bénin en matière de protection des données à caractère personnel et signale immédiatement toute fuite, perte ou diffusion accidentelle dont il aurait connaissance.",
      },
      {
        label: "Durée de l'obligation",
        text: "L'obligation de confidentialité survit à la fin de la collaboration, sans limitation de durée.",
      },
    ],
  },
  {
    id: "suivi",
    title: "Obligations de suivi et de correction",
    summary: "Corrections réactives, notes impartiales, présences tenues.",
    intro:
      "Le cœur de la mission est le suivi des apprenants : corriger les travaux, répondre aux questions et tenir les sessions annoncées.",
    clauses: [
      {
        label: "Réactivité",
        text: "Le formateur accuse réception des travaux et des questions sous 48 heures ouvrées et rend ses corrections sous 5 jours ouvrés après le rendu, ou dans le délai annoncé au sujet lorsque celui-ci est plus court.",
      },
      {
        label: "Notation impartiale",
        text: "La notation applique les critères annoncés à l'avance, sans favoritisme ni discrimination. Toute demande de révision est examinée et motivée par écrit.",
      },
      {
        label: "Feedback constructif",
        text: "Chaque correction s'accompagne d'un retour écrit argumenté : ce qui est acquis, ce qui doit être repris et la ressource ou l'exercice à consulter pour progresser.",
      },
      {
        label: "Présences et sessions",
        text: "Le formateur tient les présences de manière assidue, est ponctuel, prévient de tout empêchement dès qu'il le connaît et ne reprogramme une session qu'avec l'accord de l'administration.",
      },
      {
        label: "Intégrité des résultats",
        text: "Les notes et les tentatives de quiz ne sont pas modifiées rétroactivement sans justification écrite et sans laisser de trace dans l'historique de la plateforme.",
      },
      {
        label: "Signalement",
        text: "Le formateur signale à l'administration les difficultés durables d'un apprenant (désengagement, blocage) plutôt que de traiter la situation de sa propre initiative hors du cadre défini.",
      },
    ],
    note: "Les délais de 48 heures et de 5 jours ouvrés sont les valeurs actuellement en vigueur ; ils peuvent être ajustés par l'administration, qui en informe les formateurs avant application.",
  },
  {
    id: "assistant-ia",
    title: `Utilisation de l'assistant IA (${SITE.name} Intelligence)`,
    summary: "L'assistant propose ; le formateur vérifie, décide et assume.",
    intro: `L'assistant ${SITE.name} Intelligence est intégré à ${SITE.tool} pour aider à préparer les contenus, les quiz et les retours pédagogiques.`,
    clauses: [
      {
        label: "Outil d'aide et de préparation",
        text: `${SITE.name} Intelligence peut suggérer un plan de leçon, une reformulation, des questions d'évaluation ou une première trame de retour sur un travail rendu. Il reste un assistant de préparation.`,
      },
      {
        label: "Pleine responsabilité humaine",
        text: "Le formateur relit, vérifie et valide chaque suggestion. Il reste seul responsable des contenus publiés, des notes attribuées et des retours adressés aux apprenants.",
      },
      {
        label: "Aucune décision automatique",
        text: "Aucune évaluation, aucune note et aucune décision de validation ne peut être laissée à l'assistant. Les suggestions ne remplacent pas la correction et ne s'imposent jamais à l'apprenant.",
      },
      {
        label: "Données des apprenants",
        text: "Le formateur ne transmet pas à l'assistant d'informations personnelles ni de travaux permettant d'identifier un apprenant ; il anonymise les extraits qu'il utilise pour préparer un retour.",
      },
      {
        label: "Transparence",
        text: "Un support largement produit avec l'assistant est signalé à l'administration avant publication. L'assistant ne doit jamais être présenté à l'apprenant comme une correction officielle du centre.",
      },
      {
        label: "Vérification des informations",
        text: "Les informations factuelles, chiffrées, techniques ou juridiques proposées par l'assistant sont vérifiées par le formateur avant d'être diffusées.",
      },
    ],
  },
  {
    id: "deontologie",
    title: "Déontologie, loyauté et résiliation",
    summary: "Aucun démarchage des apprenants ; accès suspendu en cas de manquement.",
    intro:
      "La collaboration repose sur la confiance réciproque, la loyauté et le respect des apprenants comme du centre.",
    clauses: [
      {
        label: "Non-sollicitation des apprenants",
        text: "Pendant la session et pendant 12 mois après son terme, le formateur ne sollicite pas directement un apprenant qu'il a suivi pour une prestation privée concurrente, une mission rémunérée hors plateforme ou un transfert vers un autre organisme de formation.",
      },
      {
        label: "Interdiction de contournement",
        text: "Les contacts, coordonnées, annuaires et listes constitués grâce à la plateforme ne peuvent être utilisés pour une activité commerciale personnelle.",
      },
      {
        label: "Conflits d'intérêts",
        text: "Le formateur déclare à l'administration toute activité susceptible d'entrer en conflit avec celle du centre. Une prestation privée avec un apprenant ne peut être réalisée qu'avec un accord écrit préalable.",
      },
      {
        label: "Loyauté et image",
        text: "Le formateur ne divulgue ni conditions tarifaires internes, ni documents de travail du centre, et ne publie aucun commentaire dénigrant la plateforme, ses équipes ou ses apprenants.",
      },
      {
        label: "Manquements",
        text: "Un manquement à la présente charte peut entraîner, selon sa gravité : un rappel à l'ordre écrit, la suspension temporaire de l'accès à certaines fonctions, la suspension d'accès à la plateforme, ou la fin de la collaboration.",
      },
      {
        label: "Procédure",
        text: "La décision est notifiée par écrit avec ses motifs. Le formateur dispose de 7 jours pour présenter ses explications, sauf risque immédiat pour les apprenants, leurs données ou le centre, auquel cas la suspension peut prendre effet immédiatement.",
      },
      {
        label: "Fin de collaboration",
        text: "À la fin de la collaboration, l'accès est retiré, les supports internes sont restitués ou détruits, et les corrections en cours sont finalisées ou remises à un autre formateur.",
      },
    ],
  },
];
