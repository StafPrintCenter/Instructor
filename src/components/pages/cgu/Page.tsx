import { LegalArticleSection, LegalDocShell, LegalKeyPoints } from "@/components/site";
import { SITE } from "@/data/site";
import { AcceptanceSection } from "./Acceptance";
import { ContentSection } from "./Content";

const VERSION = "1.0";
const UPDATED_AT = "31 octobre 2026";

export function CharterPage() {
  return (
    <LegalDocShell
      eyebrow={`Document contractuel - ${SITE.tool}`}
      title="Charte d'engagement et Conditions Générales d'Utilisation"
      description={`Ce document fixe les règles d'intervention des formateurs sur ${SITE.tool} de ${SITE.name} : périmètre de chacun, droits sur les contenus, protection des apprenants, exigences de correction, usage de l'assistant IA et suites en cas de manquement. La création ou la poursuite d'un compte formateur vaut acceptation de ces règles.`}
      meta={[
        { label: "Version", value: VERSION },
        { label: "Dernière mise à jour", value: UPDATED_AT },
        { label: "Concerne", value: "Comptes formateurs actifs et demandeurs d'accès" },
        { label: "Lecture", value: "≈ 8 minutes" },
      ]}
      sections={ContentSection}
    >
      <LegalKeyPoints items={ContentSection.map((section) => ({ title: section.title, text: section.summary }))} />

      {ContentSection.map((section, index) => (
        <LegalArticleSection key={section.id} section={section} index={index} />
      ))}

      <AcceptanceSection />
    </LegalDocShell>
  );
}
