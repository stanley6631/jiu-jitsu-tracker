import { useCompetitions } from "@/hooks/useCompetitions";
import type { Competition } from "@/types";

export default function CompetitionInfoCard() {
  const { data: compData = [] } = useCompetitions();

  return (
    <>
      {compData?.length ? (
        compData.map((comp: Competition) => (
          <div key={comp.id}>
            <p>{comp.comp_date.toString()}</p>
            <p>{comp.name}</p>
          </div>
        ))
      ) : (
        <p>No incomming competitions.</p>
      )}
    </>
  );
}
