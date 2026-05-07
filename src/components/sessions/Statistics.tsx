import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatCard from "@/components/sessions/StatCard";

export default function Statistics() {
  const { data, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="flex gap-4 w-full max-w-2xl mb-8">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="flex-1 animate-pulse bg-black ring-0 border border-white"
          >
            <CardHeader>
              <div className="h-4 w-24 rounded bg-white/10" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 rounded bg-white/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full max-w-2xl mb-8">
      <StatCard
        label="Trainings this month"
        value={data?.thisMonthCount ?? 0}
      />
      <StatCard
        label="Trainings last month"
        value={data?.lastMonthCount ?? 0}
      />
      <StatCard label="Top submission" value={data?.topSubmission ?? null} />
    </div>
  );
}
