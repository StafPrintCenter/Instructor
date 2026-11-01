import { createFileRoute } from "@tanstack/react-router";
import { CharterPage } from "@/components/pages/cgu/CharterPage";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Charte d'engagement et CGU ${SITE.tool} - ${SITE.name}`;
const PAGE_DESCRIPTION = `Charte d'engagement et Conditions Générales d'Utilisation applicables aux formateurs de ${SITE.name} : gouvernance, propriété des contenus, confidentialité des apprenants, obligations de correction, usage de l'assistant IA et déontologie.`;

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      {
        property: "og:description",
        content: `Les règles qui encadrent l'intervention des formateurs sur ${SITE.tool} de ${SITE.name}.`,
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/charte" },
    ],
    links: [{ rel: "canonical", href: "/charte" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Charte d'engagement et Conditions Générales d'Utilisation - ${SITE.tool}`,
          description: `Règles applicables aux formateurs intervenant sur ${SITE.tool} de ${SITE.name}.`,
          inLanguage: "fr-BJ",
          dateModified: "2026-10-31",
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            description: `${SITE.activity}, centre de formation basé à ${SITE.city}.`,
            telephone: SITE.phone,
            email: SITE.email,
          },
        }),
      },
    ],
  }),
  component: CharterPage,
});
