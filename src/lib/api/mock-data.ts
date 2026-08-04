import type {
  Enrollment,
  Instructor,
  Lesson,
  Module,
  Student,
  Submission,
  Training,
  TrainingSession,
  CommunityPost,
  MessageThread,
  AppNotification,
  ContentReview,
  QuizAttempt,
  LessonCompletion,
} from "./types";

const iso = (d: string) => new Date(d).toISOString();

export const CURRENT_INSTRUCTOR_ID = "usr_1";

export const instructors: Instructor[] = [
  {
    id: "usr_1",
    full_name: "Rachidath Adjovi",
    email: "rachidath@stafprintcenter.bj",
    title: "Formatrice Design & Impression",
    bio: "10 ans de pratique en identité visuelle et production print à Cotonou. J'accompagne les apprenants du concept au fichier prêt-à-imprimer.",
    specialties: ["Design graphique", "Prépresse", "Branding"],
    avatar_url: null,
    phone: "+229 97 12 45 89",
    status: "approved",
    rejection_reason: null,
    availability: [
      { day: "lun", from: "09:00", to: "13:00", enabled: true },
      { day: "mar", from: "14:00", to: "18:00", enabled: true },
      { day: "mer", from: "09:00", to: "12:00", enabled: false },
      { day: "jeu", from: "15:00", to: "18:00", enabled: true },
      { day: "ven", from: "09:00", to: "13:00", enabled: true },
      { day: "sam", from: "10:00", to: "13:00", enabled: false },
      { day: "dim", from: "10:00", to: "12:00", enabled: false },
    ],
    notification_prefs: {
      submissions_email: true,
      session_reminders: true,
      community_mentions: true,
      admin_reviews: true,
    },
    created_at: iso("2025-01-12"),
  },
];

export const trainings: Training[] = [
  {
    id: "trn_1",
    title: "Design graphique & identité de marque",
    slug: "design-graphique",
    category: "Studio créatif",
    cover_color: "chart-1",
    summary:
      "Construire une identité de marque complète : recherche, typographie, système de couleurs et déclinaisons print.",
    cohort: "Cohorte Akpakpa 2026",
    level: "Intermédiaire",
    starts_at: iso("2026-06-01"),
    ends_at: iso("2026-09-15"),
    location: "Cotonou — Studio Akpakpa",
    enrolled_count: 4,
    instructor_ids: ["usr_1"],
  },
  {
    id: "trn_2",
    title: "Prépresse & production print",
    slug: "prepresse-production",
    category: "Impression",
    cover_color: "chart-2",
    summary:
      "Maîtriser la chaîne graphique : profils colorimétriques, fonds perdus, BAT et suivi machine.",
    cohort: "Cohorte Ganhi 2026",
    level: "Avancé",
    starts_at: iso("2026-07-06"),
    ends_at: iso("2026-10-20"),
    location: "Cotonou — Atelier Ganhi",
    enrolled_count: 3,
    instructor_ids: ["usr_1"],
  },
  {
    id: "trn_3",
    title: "Motion design pour réseaux sociaux",
    slug: "motion-design",
    category: "Studio créatif",
    cover_color: "chart-4",
    summary: "Animer une charte de marque pour les formats sociaux verticaux.",
    cohort: "Cohorte Calavi 2026",
    level: "Débutant",
    starts_at: iso("2026-08-03"),
    ends_at: iso("2026-11-10"),
    location: "En ligne",
    enrolled_count: 0,
    /** volontairement non assignée à usr_1 : ne doit jamais apparaître */
    instructor_ids: ["usr_9"],
  },
];

export const modules: Module[] = [
  {
    id: "mod_1",
    training_id: "trn_1",
    title: "Fondations de l'identité visuelle",
    description: "Brief client, recherche, moodboard et positionnement.",
    position: 1,
    is_active: true,
    status: "approved",
  },
  {
    id: "mod_2",
    training_id: "trn_1",
    title: "Système typographique & couleur",
    description: "Choisir, associer et documenter les styles.",
    position: 2,
    is_active: true,
    status: "submitted",
  },
  {
    id: "mod_3",
    training_id: "trn_1",
    title: "Déclinaisons print & livrables",
    description: "Cartes, affiches, packaging et charte finale.",
    position: 3,
    is_active: false,
    status: "draft",
  },
  {
    id: "mod_4",
    training_id: "trn_2",
    title: "Chaîne graphique & colorimétrie",
    description: "CMJN, profils ICC, épreuvage.",
    position: 1,
    is_active: true,
    status: "approved",
  },
  {
    id: "mod_5",
    training_id: "trn_2",
    title: "Contrôle qualité et BAT",
    description: "Préflight, fonds perdus, validation client.",
    position: 2,
    is_active: true,
    status: "rejected",
  },
];

export const lessons: Lesson[] = [
  {
    id: "les_1",
    module_id: "mod_1",
    training_id: "trn_1",
    title: "Lire un brief client et poser les bonnes questions",
    type: "video",
    position: 1,
    duration_minutes: 18,
    status: "approved",
    is_active: true,
    video_url: "https://videos.stafprint.bj/brief-client.mp4",
    chapters: [
      { id: "chp_1", label: "Décoder la demande", timecode: "00:00" },
      { id: "chp_2", label: "Questions de cadrage", timecode: "06:20" },
      { id: "chp_3", label: "Restituer le brief", timecode: "12:05" },
    ],
    updated_at: iso("2026-06-11"),
  },
  {
    id: "les_2",
    module_id: "mod_1",
    training_id: "trn_1",
    title: "Anatomie d'un moodboard efficace",
    type: "reading",
    position: 2,
    duration_minutes: 12,
    status: "approved",
    is_active: true,
    content:
      "Un moodboard n'est pas une collection d'images jolies : c'est un argumentaire visuel. Chaque référence doit répondre à un attribut de marque identifié dans le brief...",
    updated_at: iso("2026-06-12"),
  },
  {
    id: "les_3",
    module_id: "mod_1",
    training_id: "trn_1",
    title: "Quiz — Cadrage de projet",
    type: "quiz",
    position: 3,
    duration_minutes: 10,
    status: "submitted",
    is_active: true,
    quiz: {
      time_limit_minutes: 10,
      pass_threshold: 70,
      max_attempts: 3,
      manual_grading: false,
      questions: [
        {
          id: "qst_1",
          prompt: "Quel élément est indispensable dans un brief de marque ?",
          kind: "single",
          points: 10,
          position: 1,
          options: [
            { id: "opt_1", label: "Le budget d'impression du client", is_correct: false },
            { id: "opt_2", label: "Le positionnement et la cible", is_correct: true },
            { id: "opt_3", label: "La police préférée du designer", is_correct: false },
          ],
        },
        {
          id: "qst_2",
          prompt: "Quelles pratiques renforcent un moodboard ? (plusieurs réponses)",
          kind: "multiple",
          points: 15,
          position: 2,
          options: [
            { id: "opt_4", label: "Associer chaque image à un attribut de marque", is_correct: true },
            { id: "opt_5", label: "Ajouter le maximum de références", is_correct: false },
            { id: "opt_6", label: "Documenter la palette dominante", is_correct: true },
          ],
        },
      ],
    },
    updated_at: iso("2026-06-18"),
  },
  {
    id: "les_4",
    module_id: "mod_2",
    training_id: "trn_1",
    title: "Exercice — Construire une échelle typographique",
    type: "exercise",
    position: 1,
    duration_minutes: 45,
    status: "draft",
    is_active: true,
    brief:
      "Produisez une échelle typographique cohérente (6 niveaux) pour la marque fictive « Zémi Coffee » et justifiez chaque choix en 3 lignes.",
    quiz: {
      time_limit_minutes: null,
      pass_threshold: 60,
      max_attempts: 2,
      manual_grading: true,
      questions: [],
    },
    updated_at: iso("2026-06-25"),
  },
  {
    id: "les_5",
    module_id: "mod_2",
    training_id: "trn_1",
    title: "Devoir — Charte couleur documentée",
    type: "assignment",
    position: 2,
    duration_minutes: 90,
    status: "approved",
    is_active: true,
    brief: "Livrez une planche couleur (PDF) avec valeurs CMJN, RVB et usages recommandés.",
    updated_at: iso("2026-06-28"),
  },
  {
    id: "les_6",
    module_id: "mod_4",
    training_id: "trn_2",
    title: "Profils ICC : de l'écran à la presse",
    type: "video",
    position: 1,
    duration_minutes: 24,
    status: "approved",
    is_active: true,
    video_url: "https://videos.stafprint.bj/profils-icc.mp4",
    chapters: [{ id: "chp_4", label: "Espaces colorimétriques", timecode: "00:00" }],
    updated_at: iso("2026-07-08"),
  },
  {
    id: "les_7",
    module_id: "mod_5",
    training_id: "trn_2",
    title: "Projet — Dossier de production complet",
    type: "project",
    position: 1,
    duration_minutes: 240,
    status: "rejected",
    is_active: true,
    brief: "Constituez le dossier de production d'un packaging : préflight, BAT, gamme de montage.",
    updated_at: iso("2026-07-14"),
  },
];

export const students: Student[] = [
  { id: "std_1", full_name: "Kossi Aholou", email: "kossi@mail.bj", phone: "+229 96 01 22 33", avatar_url: null, city: "Cotonou" },
  { id: "std_2", full_name: "Mariam Sadikou", email: "mariam@mail.bj", phone: "+229 95 44 21 09", avatar_url: null, city: "Porto-Novo" },
  { id: "std_3", full_name: "Ulrich Dossou", email: "ulrich@mail.bj", phone: "+229 97 88 10 54", avatar_url: null, city: "Abomey-Calavi" },
  { id: "std_4", full_name: "Fatou Bio", email: "fatou@mail.bj", phone: "+229 94 30 76 12", avatar_url: null, city: "Parakou" },
  { id: "std_5", full_name: "Serge Hounkpatin", email: "serge@mail.bj", phone: "+229 96 55 44 01", avatar_url: null, city: "Cotonou" },
];

export const enrollments: Enrollment[] = [
  { id: "enr_1", student_id: "std_1", training_id: "trn_1", progress: 68, attendance_rate: 92, payment_status: "paid", last_activity_at: iso("2026-07-29T16:20:00"), enrolled_at: iso("2026-06-01") },
  { id: "enr_2", student_id: "std_2", training_id: "trn_1", progress: 41, attendance_rate: 74, payment_status: "partial", last_activity_at: iso("2026-07-28T09:05:00"), enrolled_at: iso("2026-06-01") },
  { id: "enr_3", student_id: "std_3", training_id: "trn_1", progress: 87, attendance_rate: 98, payment_status: "paid", last_activity_at: iso("2026-07-30T08:40:00"), enrolled_at: iso("2026-06-03") },
  { id: "enr_4", student_id: "std_4", training_id: "trn_1", progress: 22, attendance_rate: 55, payment_status: "late", last_activity_at: iso("2026-07-18T11:10:00"), enrolled_at: iso("2026-06-05") },
  { id: "enr_5", student_id: "std_2", training_id: "trn_2", progress: 55, attendance_rate: 88, payment_status: "paid", last_activity_at: iso("2026-07-29T18:00:00"), enrolled_at: iso("2026-07-06") },
  { id: "enr_6", student_id: "std_5", training_id: "trn_2", progress: 33, attendance_rate: 67, payment_status: "pending", last_activity_at: iso("2026-07-27T14:35:00"), enrolled_at: iso("2026-07-06") },
  { id: "enr_7", student_id: "std_3", training_id: "trn_2", progress: 12, attendance_rate: 80, payment_status: "partial", last_activity_at: iso("2026-07-26T10:15:00"), enrolled_at: iso("2026-07-08") },
];

export const completions: LessonCompletion[] = [
  { id: "cmp_1", student_id: "std_1", lesson_id: "les_1", lesson_title: "Lire un brief client", lesson_type: "video", completed_at: iso("2026-06-14") },
  { id: "cmp_2", student_id: "std_1", lesson_id: "les_2", lesson_title: "Anatomie d'un moodboard", lesson_type: "reading", completed_at: iso("2026-06-19") },
  { id: "cmp_3", student_id: "std_1", lesson_id: "les_3", lesson_title: "Quiz — Cadrage de projet", lesson_type: "quiz", completed_at: iso("2026-06-24") },
  { id: "cmp_4", student_id: "std_2", lesson_id: "les_1", lesson_title: "Lire un brief client", lesson_type: "video", completed_at: iso("2026-06-16") },
  { id: "cmp_5", student_id: "std_3", lesson_id: "les_1", lesson_title: "Lire un brief client", lesson_type: "video", completed_at: iso("2026-06-12") },
  { id: "cmp_6", student_id: "std_3", lesson_id: "les_5", lesson_title: "Devoir — Charte couleur", lesson_type: "assignment", completed_at: iso("2026-07-11") },
  { id: "cmp_7", student_id: "std_5", lesson_id: "les_6", lesson_title: "Profils ICC", lesson_type: "video", completed_at: iso("2026-07-20") },
];

export const quizAttempts: QuizAttempt[] = [
  { id: "att_1", student_id: "std_1", lesson_id: "les_3", lesson_title: "Quiz — Cadrage de projet", score: 55, attempt_number: 1, passed: false, taken_at: iso("2026-06-22") },
  { id: "att_2", student_id: "std_1", lesson_id: "les_3", lesson_title: "Quiz — Cadrage de projet", score: 88, attempt_number: 2, passed: true, taken_at: iso("2026-06-24") },
  { id: "att_3", student_id: "std_2", lesson_id: "les_3", lesson_title: "Quiz — Cadrage de projet", score: 62, attempt_number: 1, passed: false, taken_at: iso("2026-06-26") },
  { id: "att_4", student_id: "std_3", lesson_id: "les_3", lesson_title: "Quiz — Cadrage de projet", score: 94, attempt_number: 1, passed: true, taken_at: iso("2026-06-21") },
];

export const submissions: Submission[] = [
  { id: "sub_1", student_id: "std_1", training_id: "trn_1", lesson_id: "les_4", lesson_title: "Exercice — Échelle typographique", type: "exercise", content: "Échelle en 6 niveaux basée sur un ratio 1.25, police Fraunces pour les titres.", attachment_name: "echelle-zemi.pdf", submitted_at: iso("2026-07-24T10:00:00"), status: "pending", grade: null, feedback: null, graded_at: null },
  { id: "sub_2", student_id: "std_2", training_id: "trn_1", lesson_id: "les_5", lesson_title: "Devoir — Charte couleur documentée", type: "assignment", content: "Palette 4 couleurs + neutres, valeurs CMJN vérifiées sur épreuve.", attachment_name: "charte-couleur.pdf", submitted_at: iso("2026-07-21T15:30:00"), status: "pending", grade: null, feedback: null, graded_at: null },
  { id: "sub_3", student_id: "std_4", training_id: "trn_1", lesson_id: "les_4", lesson_title: "Exercice — Échelle typographique", type: "exercise", content: "Première version, ratio non documenté.", attachment_name: null, submitted_at: iso("2026-07-12T08:15:00"), status: "pending", grade: null, feedback: null, graded_at: null },
  { id: "sub_4", student_id: "std_5", training_id: "trn_2", lesson_id: "les_7", lesson_title: "Projet — Dossier de production", type: "project", content: "Dossier packaging complet avec gamme de montage.", attachment_name: "dossier-prod.zip", submitted_at: iso("2026-07-28T19:45:00"), status: "pending", grade: null, feedback: null, graded_at: null },
  { id: "sub_5", student_id: "std_3", training_id: "trn_1", lesson_id: "les_5", lesson_title: "Devoir — Charte couleur documentée", type: "assignment", content: "Charte complète avec usages print et web.", attachment_name: "charte-ulrich.pdf", submitted_at: iso("2026-07-10T12:00:00"), status: "graded", grade: 92, feedback: "Excellent niveau de documentation, continue ainsi.", graded_at: iso("2026-07-12T09:00:00") },
];

export const sessions: TrainingSession[] = [
  { id: "ses_1", training_id: "trn_1", title: "Atelier moodboard collectif", mode: "onsite", starts_at: iso("2026-08-04T09:00:00"), duration_minutes: 180, location: "Studio Akpakpa", notes: "Apporter les recherches imprimées.", attendance: [ { student_id: "std_1", present: true }, { student_id: "std_2", present: false }, { student_id: "std_3", present: true }, { student_id: "std_4", present: false } ] },
  { id: "ses_2", training_id: "trn_1", title: "Revue de projets — live", mode: "live", starts_at: iso("2026-08-11T15:00:00"), duration_minutes: 120, location: "Visio", notes: "Chaque apprenant présente 5 min.", attendance: [] },
  { id: "ses_3", training_id: "trn_2", title: "Visite atelier impression", mode: "onsite", starts_at: iso("2026-08-18T08:30:00"), duration_minutes: 240, location: "Atelier Ganhi", notes: "Chaussures fermées obligatoires.", attendance: [] },
];

export const posts: CommunityPost[] = [
  { id: "pst_1", training_id: "trn_1", author_id: "usr_1", author_name: "Rachidath Adjovi", author_role: "instructor", body: "Rappel : les rendus de charte couleur sont attendus vendredi avant 18h. Pensez à intégrer les valeurs CMJN.", pinned: true, created_at: iso("2026-07-27T09:00:00"), replies_count: 4 },
  { id: "pst_2", training_id: "trn_1", author_id: "std_2", author_name: "Mariam Sadikou", author_role: "student", body: "Quelqu'un a une bonne ressource sur les ratios typographiques ?", pinned: false, created_at: iso("2026-07-28T11:20:00"), replies_count: 2 },
  { id: "pst_3", training_id: "trn_2", author_id: "std_5", author_name: "Serge Hounkpatin", author_role: "student", body: "Le préflight refuse mes fonds perdus, une piste ?", pinned: false, created_at: iso("2026-07-29T16:05:00"), replies_count: 1 },
];

export const threads: MessageThread[] = [
  { id: "thr_1", student_id: "std_1", training_id: "trn_1", subject: "Retour sur mon échelle typographique", updated_at: iso("2026-07-29T17:40:00"), unread: true, messages: [ { id: "msg_1", author: "student", body: "Bonjour, pouvez-vous regarder mon rendu avant la correction ?", sent_at: iso("2026-07-29T17:40:00") } ] },
  { id: "thr_2", student_id: "std_4", training_id: "trn_1", subject: "Absence atelier du 4 août", updated_at: iso("2026-07-26T08:10:00"), unread: false, messages: [ { id: "msg_2", author: "student", body: "Je serai à Parakou ce jour-là.", sent_at: iso("2026-07-26T08:10:00") }, { id: "msg_3", author: "instructor", body: "Noté, je vous partagerai l'enregistrement.", sent_at: iso("2026-07-26T09:02:00") } ] },
];

export const notifications: AppNotification[] = [
  { id: "ntf_1", kind: "review", title: "Module refusé par l'administration", body: "« Contrôle qualité et BAT » : préciser la procédure de préflight.", created_at: iso("2026-07-28T10:00:00"), read: false },
  { id: "ntf_2", kind: "submission", title: "Nouvelle soumission", body: "Serge Hounkpatin a rendu le projet Dossier de production.", created_at: iso("2026-07-28T19:46:00"), read: false },
  { id: "ntf_3", kind: "session", title: "Session à venir", body: "Atelier moodboard collectif le 4 août à 09:00.", created_at: iso("2026-07-30T07:00:00"), read: true },
];

export const reviews: ContentReview[] = [
  { id: "rev_1", entity_type: "module", entity_id: "mod_2", entity_title: "Système typographique & couleur", status: "submitted", admin_comment: null, submitted_at: iso("2026-07-22"), reviewed_at: null },
  { id: "rev_2", entity_type: "module", entity_id: "mod_5", entity_title: "Contrôle qualité et BAT", status: "rejected", admin_comment: "Ajouter une check-list de préflight avant publication.", submitted_at: iso("2026-07-19"), reviewed_at: iso("2026-07-28") },
  { id: "rev_3", entity_type: "lesson", entity_id: "les_3", entity_title: "Quiz — Cadrage de projet", status: "submitted", admin_comment: null, submitted_at: iso("2026-07-25"), reviewed_at: null },
  { id: "rev_4", entity_type: "lesson", entity_id: "les_7", entity_title: "Projet — Dossier de production complet", status: "rejected", admin_comment: "Le barème n'est pas explicite pour les apprenants.", submitted_at: iso("2026-07-16"), reviewed_at: iso("2026-07-26") },
];
