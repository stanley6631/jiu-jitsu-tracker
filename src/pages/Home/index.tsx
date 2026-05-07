import { Link } from "react-router-dom";
import { useSessionLogs } from "../../hooks/useSessionLogs";
import SessionsList from "@/components/sessions/SessionsList";
import Statistics from "@/components/sessions/Statistics";

export default function Home() {
  const { data } = useSessionLogs(1, 5);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white">
        Brazilian Jiu-Jitsu Tracker
      </h1>
      <p className="mt-4 max-w-md text-gray-400">
        Log your training sessions, track the techniques you're focusing on, and
        review your progress over time.
      </p>
      <div className="mt-8 flex gap-4 mb-12">
        <Link
          to="/log/new"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Log Today's Session
        </Link>
        <Link
          to="/history"
          className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
        >
          View History
        </Link>
      </div>
      {data && data.data.length > 0 && <Statistics />}
      {data && data.data.length > 0 && <SessionsList data={data.data} />}
    </div>
  );
}
