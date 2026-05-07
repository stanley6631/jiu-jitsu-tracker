import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number | null;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="flex-1 bg-black ring-0 border border-white">
      <CardHeader>
        <CardTitle className="text-white text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-xl font-bold text-white">{value ?? "—"}</span>
      </CardContent>
    </Card>
  );
}
