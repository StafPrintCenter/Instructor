export type LegalClause = { label: string; text: string };

export type LegalSection = {
  id: string;
  title: string;
  summary: string;
  intro?: string;
  clauses: LegalClause[];
  note?: string;
};

export type LegalMeta = { label: string; value: string };
