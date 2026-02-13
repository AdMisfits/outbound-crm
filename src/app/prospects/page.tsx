import Nav from "../nav";
import type { Prospect } from "@/lib/types";

const TIER_LABELS: Record<string, string> = {
  "70_30": "70/30",
  "40pct": "40%",
  "10pct": "10%",
  decline: "Decline",
};

const TIER_COLORS: Record<string, string> = {
  "70_30": "bg-emerald-500/20 text-emerald-400",
  "40pct": "bg-blue-500/20 text-blue-400",
  "10pct": "bg-amber-500/20 text-amber-400",
  decline: "bg-gray-500/20 text-gray-400",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-500/20 text-gray-400",
  sent: "bg-blue-500/20 text-blue-400",
  replied: "bg-amber-500/20 text-amber-400",
  meeting_booked: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
};

function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const color =
    score === null
      ? "bg-gray-700"
      : score >= 4
        ? "bg-emerald-500"
        : score >= 3
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-500 w-3">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-3 rounded-sm ${i <= (score ?? 0) ? color : "bg-gray-800"}`}
          />
        ))}
      </div>
    </div>
  );
}

async function getProspects(): Promise<Prospect[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/prospects`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProspectsPage() {
  const prospects = await getProspects();

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Prospects</h1>
          <span className="text-sm text-gray-500">{prospects.length} total</span>
        </div>

        {prospects.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            No prospects yet. Run /outbound-scout to start finding them.
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">EDTP Scores</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Trend</th>
                  <th className="px-4 py-3">Outreach</th>
                  <th className="px-4 py-3">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {prospects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.company_name}</div>
                      <div className="text-xs text-gray-500">
                        {p.founder_name && (
                          <>
                            {p.founder_linkedin ? (
                              <a
                                href={p.founder_linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {p.founder_name}
                              </a>
                            ) : (
                              p.founder_name
                            )}
                          </>
                        )}
                      </div>
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-gray-600 hover:text-gray-400"
                        >
                          {new URL(p.website).hostname}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-sm truncate">
                        {p.offer_description || "-"}
                      </div>
                      {p.price_point && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {p.price_point}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <ScoreBar score={p.e_score} label="E" />
                        <ScoreBar score={p.d_score} label="D" />
                        <ScoreBar score={p.t_score} label="T" />
                        <ScoreBar score={p.p_score} label="P" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.tier && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_COLORS[p.tier]}`}
                        >
                          {TIER_LABELS[p.tier]}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-[150px] truncate">
                      {p.trend_thesis || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.outreach_status]}`}
                      >
                        {p.outreach_status.replace("_", " ")}
                      </span>
                      {p.outreach_channel && (
                        <div className="text-[10px] text-gray-600 mt-0.5">
                          via {p.outreach_channel}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
