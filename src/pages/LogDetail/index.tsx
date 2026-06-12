import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSessionLog } from "@/hooks/useSessionLog";
import { formatDate } from "@/lib/utils";

export default function LogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSessionLog(id ?? "");

  return (
    <div className="max-w-2xl">
      <Link
        to="/history"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </Link>

      {isLoading && <p className="text-gray-400">Loading…</p>}
      {isError && (
        <p className="text-destructive">Failed to load session details.</p>
      )}

      {data && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-white text-lg font-medium">
              {formatDate(data.session_time)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">
              Session Type
            </p>
            <p className="text-white text-lg font-medium">
              {data.is_gi_session ? "Gi" : "Nogi"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">
              Session Focus
            </p>
            <p className="text-white whitespace-pre-wrap">
              {data.session_focus}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
              Submissions
            </p>
            {data.submissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No submissions recorded.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {data.submissions.map((submission) => (
                  <li
                    key={submission.id}
                    className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                  >
                    {submission.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
