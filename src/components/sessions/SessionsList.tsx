import type { SessionLog } from "@/types";
import { truncate, formatDate } from "@/lib/utils";

interface SessionsListProps {
  data: SessionLog[];
}

export default function SessionsList({ data }: SessionsListProps) {
  return (
    <ul>
      {data.map((log, index) => (
        <li key={log.id}>
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-white flex-1 min-w-0 truncate">
              {truncate(log.session_focus)}
            </span>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {formatDate(log.session_time)}
            </span>
          </div>
          {index < data.length - 1 && <hr className="border-white/10" />}
        </li>
      ))}
    </ul>
  );
}
