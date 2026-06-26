import { useCompetitions } from "@/hooks/useCompetitions";
import type { Competition } from "@/types";
import CompetitionInfoCard from "./CompetitionInfoCard";

export default function Competitions() {
  const { data: compData = [] } = useCompetitions();

  if (!compData.length) {
    return (
      <p className="mb-8 text-sm text-gray-500">No upcoming competitions.</p>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
        You have upcoming competitions
      </h2>
      <div className="mb-8 flex w-full max-w-md flex-col gap-3 text-left">
        {compData.map((competition: Competition) => (
          <CompetitionInfoCard competition={competition} />
        ))}
      </div>
    </div>
  );
}
