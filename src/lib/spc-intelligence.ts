import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

const LABELS: [RegExp, string, string][] = [
  [/^\/dashboard(?:\/|$)/, "Tableau de bord formateur", "Vue d'ensemble des formations, de la progression des apprenants, des travaux à corriger et des prochaines sessions."],
  [/^\/trainings\/[^/]+\/sessions\/[^/]+(?:\/|$)/, "Détail d'une session de formation", "Consultez les informations et le suivi d'une session liée à une formation."],
  [/^\/trainings\/[^/]+\/students\/[^/]+(?:\/|$)/, "Suivi d'un apprenant en formation", "Consultez la progression et l'activité d'un apprenant dans une formation."],
  [/^\/trainings\/[^/]+\/submissions(?:\/|$)/, "Travaux rendus d'une formation", "Consultez, évaluez et validez les travaux remis dans cette formation."],
  [/^\/trainings\/[^/]+\/manage(?:\/|$)/, "Contenu de la formation", "Organisez les modules, les leçons, les quiz et les exercices d'une formation."],
  [/^\/trainings\/[^/]+(?:\/|$)/, "Détail d'une formation", "Consultez les objectifs, les sessions, les apprenants inscrits et l'avancement de la formation."],
  [/^\/trainings(?:\/|$)/, "Mes formations", "Consultez vos formations assignées et l'avancement de leurs apprenants."],
  [/^\/students\/[^/]+(?:\/|$)/, "Profil d'un apprenant", "Consultez la progression et l'activité récente d'un apprenant dans vos formations."],
  [/^\/students(?:\/|$)/, "Mes apprenants", "Retrouvez les apprenants inscrits à vos formations et suivez leur progression."],
  [/^\/corrections\/[^/]+(?:\/|$)/, "Détail d'une correction", "Consultez le travail remis, les consignes pédagogiques et l'historique des corrections."],
  [/^\/corrections(?:\/|$)/, "Corrections", "Filtrez les travaux remis dans vos formations et corrigez-les."],
  [/^\/submissions(?:\/|$)/, "Travaux rendus", "Consultez, évaluez ou validez les travaux déposés par vos apprenants."],
  [/^\/sessions\/[^/]+(?:\/|$)/, "Détail d'une session", "Consultez les informations et la date d'une session de formation."],
  [/^\/sessions(?:\/|$)/, "Sessions de formation", "Planifiez vos sessions en présentiel ou en ligne et suivez les réponses des apprenants."],
  [/^\/community\/posts\/[^/]+(?:\/|$)/, "Publication de la communauté", "Consultez une publication et ses commentaires."],
  [/^\/community\/posts(?:\/|$)/, "Communauté", "Consultez et publiez des discussions, questions, ressources et annonces."],
  [/^\/community\/reports\/[^/]+(?:\/|$)/, "Détail d'un signalement", "Examinez un contenu signalé dans la communauté."],
  [/^\/community\/reports(?:\/|$)/, "Modération de la communauté", "Traitez les contenus signalés par les apprenants."],
  [/^\/notifications\/preferences(?:\/|$)/, "Préférences de notifications", "Choisissez les notifications à recevoir au sujet de vos formations et de vos apprenants."],
  [/^\/notifications\/[^/]+(?:\/|$)/, "Détail d'une notification", "Consultez une notification liée à votre espace formateur."],
  [/^\/notifications(?:\/|$)/, "Notifications", "Consultez les notifications liées à vos formations, vos apprenants et vos prochaines sessions."],
  [/^\/security\/mfa(?:\/|$)/, "Sécurité du compte", "Gérez la double authentification, les méthodes de connexion et les codes de secours."],
  [/^\/security\/sessions(?:\/|$)/, "Sessions actives", "Consultez et fermez les sessions ouvertes sur votre compte formateur."],
  [/^\/health(?:\/|$)/, "Santé du compte", "Consultez le score de sécurité et de profil ainsi que les recommandations pour l'améliorer."],
  [/^\/profile(?:\/|$)/, "Mon profil formateur", "Consultez les informations de votre compte et gérez vos catégories préférées."],
  [/^\/cgu(?:\/|$)/, "Charte d'engagement et CGU formateur", "Consultez les règles applicables aux formateurs : gouvernance, confidentialité, corrections, usage de l'assistant IA et déontologie."],
  [/^\/login(?:\/|$)/, "Connexion formateur", "Connectez-vous à votre espace formateur."],
  [/^\/register(?:\/|$)/, "Demande d'accès formateur", "Demandez la création d'un compte formateur."],
  [/^\/invite(?:\/|$)/, "Activation du compte formateur", "Finalisez l'activation de votre compte à partir de votre invitation."],
  [/^\/forgot-password(?:\/|$)/, "Mot de passe oublié", "Demandez un lien pour réinitialiser votre mot de passe."],
  [/^\/reset-password(?:\/|$)/, "Nouveau mot de passe", "Choisissez un nouveau mot de passe pour votre compte formateur."],
];

/** Pushes the current screen (no personal data) to SPC Intelligence. */
export function useSpcPageContext() {
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => {
    const m = LABELS.find(([re]) => re.test(pathname));
    const title = m?.[1] ?? "Espace Formateur STAF PRINT CENTER";
    const text = m?.[2] ?? "Consultez et gérez votre espace formateur STAF PRINT CENTER.";
    const apply = () => window.SPCIntelligence?.setContext(() => ({ title, text }));
    apply();
    const t = window.setTimeout(apply, 1500); // widget loads async
    return () => window.clearTimeout(t);
  }, [pathname]);
}

export function askSpc(prompt: string) {
  window.SPCIntelligence?.open(prompt);
}
