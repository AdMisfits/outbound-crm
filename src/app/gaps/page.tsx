import Nav from "../nav";
import type { GapOpportunity } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  identified: "bg-blue-500/20 text-blue-400",
  researching: "bg-amber-500/20 text-amber-400",
  building: "bg-purple-500/20 text-purple-400",
  launched: "bg-emerald-500/20 text-emerald-400",
};

async function getGaps(): Promise<GapOpportunity[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gaps`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function GapsPage() {
  const gaps = await getGaps();

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gap Opportunities</h1>
          <span className="text-sm text-gray-500">{gaps.length} total</span>
        </div>

        {gaps.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            No gaps identified yet. Run /outbound-research to start finding them.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold">
                      {gap.gap_description}
                    </h2>
                    {gap.trend_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        Trend: {gap.trend_name}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ml-3 ${STATUS_COLORS[gap.status]}`}
                  >
                    {gap.status}
                  </span>
                </div>

                {gap.market_evidence && (
                  <div className="mb-3">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Market Evidence
                    </h3>
                    <p className="text-sm text-gray-300">{gap.market_evidence}</p>
                  </div>
                )}

                {gap.potential_offer_concept && (
                  <div className="mb-3">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Offer Concept
                    </h3>
                    <p className="text-sm text-gray-300">
                      {gap.potential_offer_concept}
                    </p>
                  </div>
                )}

                {gap.estimated_ticket_size && (
                  <div className="inline-block bg-gray-800 rounded px-2 py-1 text-sm font-medium text-emerald-400">
                    Est. ticket: {gap.estimated_ticket_size}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-600">
                  Identified {new Date(gap.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
