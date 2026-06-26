import { format } from "date-fns";
import { Trophy } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Competition } from "@/types";

type CompetitionInfoCard = {
  competition: Competition;
};

export default function CompetitionInfoCard({
  competition,
}: CompetitionInfoCard) {
  return (
    <div className="mb-8 flex w-full max-w-md flex-col gap-3 text-left">
      <Alert key={competition.id} variant="success">
        <Trophy />
        <AlertTitle>{competition.name}</AlertTitle>
        <AlertDescription>
          {format(new Date(competition.comp_date), "PPP")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
