import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCommunityCategories } from "@/stores/useCommunityStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { FilterSelect, authorRoleOptions, buildAudienceOptions, buildCategoryOptions, sortOptions, typeOptions, PostFiltersState } from ".";

interface PostFiltersProps {
  filters: PostFiltersState;
  onChange: (next: Partial<PostFiltersState>) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function PostFilters({ filters, onChange, hasActiveFilters, onReset }: PostFiltersProps) {
  const { categories } = useCommunityCategories();
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="community-query">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="community-query"
                className="pl-9"
                placeholder="Titre ou contenu de la publication"
                value={filters.query}
                onChange={(e) => onChange({ query: e.target.value })}
              />
            </div>
          </div>

          <FilterSelect label="Tri" value={filters.sort} options={sortOptions} onChange={(sort) => onChange({ sort })} />
          <FilterSelect label="Type" value={filters.type} options={typeOptions} onChange={(type) => onChange({ type })} />

          <FilterSelect
            label="Espace"
            className="sm:col-span-2"
            value={filters.audience}
            options={buildAudienceOptions(trainings)}
            onChange={(audience) => onChange({ audience })}
          />
          <FilterSelect
            label="Catégorie"
            value={filters.categoryId}
            options={buildCategoryOptions(categories)}
            onChange={(categoryId) => onChange({ categoryId })}
          />
          <FilterSelect
            label="Auteur"
            value={filters.authorRole}
            options={authorRoleOptions}
            onChange={(authorRole) => onChange({ authorRole })}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="community-mine" checked={filters.mine} onCheckedChange={(mine) => onChange({ mine })} />
              <Label htmlFor="community-mine" className="cursor-pointer text-sm font-normal">Mes publications</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="community-unanswered"
                checked={filters.unanswered}
                onCheckedChange={(unanswered) => onChange({ unanswered })}
              />
              <Label htmlFor="community-unanswered" className="cursor-pointer text-sm font-normal">
                Questions sans réponse
              </Label>
            </div>
          </div>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="size-4" /> Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}