import Nav from "../nav";
import { sql } from "@/lib/db";
import type { TrendThesis } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  exploring: "bg-amber-500/20 text-amber-400",
  archived: "bg-gray-500/20 text-gray-400",
};

async function getTrends(): Promise<TrendThesis[]> {
  try {
    const result = await sql`SELECT * FROM trend_theses ORDER BY created_at DESC`;
    return result.rows as unknown as TrendThesis[];
  } catch {
    return [];
  }
}

export default async function TrendsPage() {
  const trends = await getTrends();

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Trend Theses</h1>
          <span className="text-sm text-gray-500">{trends.length} total</span>
        </div>

        {trends.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            No trends yet. Run /outbound-research to start discovering them.
          </div>
        ) : (
          <div className="space-y-4">
            {trends.map((trend) => {
              const evidence = Array.isArray(trend.evidence)
                ? trend.evidence
                : [];
              const intersections = Array.isArray(trend.intersections)
                ? trend.intersections
                : [];

              return (
                <div
                  key={trend.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {trend.trend_name}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {trend.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[trend.status]}`}
                    >
                      {trend.status}
                    </span>
                  </div>

                  {evidence.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                        Evidence
                      </h3>
                      <div className="space-y-1">
                        {evidence.map(
                          (e: { source: string; data_point: string }, i: number) => (
                            <div
                              key={i}
                              className="text-sm text-gray-300 flex gap-2"
                            >
                              <span className="text-gray-600 shrink-0">
                                {e.source}:
                              </span>
                              <span>{e.data_point}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {intersections.length > 0 && (
                    <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                        Intersections
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {intersections.map(
                          (
                            int: { trends: string[]; opportunity: string },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="bg-gray-800 rounded px-3 py-1.5 text-sm"
                            >
                              <span className="text-gray-400">
                                {int.trends?.join(" + ")}
                              </span>
                              <span className="text-gray-600 mx-1.5">=</span>
                              <span className="text-gray-300">
                                {int.opportunity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-600">
                    Added {new Date(trend.created_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
