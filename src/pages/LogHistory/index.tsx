import { useState } from "react";
import { useSessionLogs } from "@/hooks/useSessionLogs";
import { PAGE_SIZE } from "@/api/sessionLogs";
import { buildPageNumbers } from "@/lib/utils";
import SessionsList from "@/components/sessions/SessionsList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function LogHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useSessionLogs(page);

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Training History</h2>
      <p className="mt-2 mb-6 text-gray-400">
        Browse your past training sessions.
      </p>

      {isLoading && <p className="text-gray-400">Loading…</p>}
      {isError && <p className="text-destructive">Failed to load sessions.</p>}

      {data && data.data.length === 0 && (
        <p className="text-gray-400">No sessions logged yet.</p>
      )}

      {data && data.data.length > 0 && (
        <>
          <SessionsList data={data.data} />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      aria-disabled={page === 1}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {pageNumbers.map((item: number | "ellipsis", i: number) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={page === totalPages}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
