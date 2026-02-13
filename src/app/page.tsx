import Nav from "./nav";
import type { DashboardData } from "@/lib/types";

const TIER_LABELS: Record<string, string> = {
  "70_30": "70/30 Partnership",
  "40pct": "40% Revenue",
  "10pct": "10% Revenue",
  decline: "Declined",
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

async function getDashboard(): Promise<DashboardData | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getDashboard();

  if (!data) {
    return (
      <>
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">
              Database not initialized yet. Run the setup endpoint first:
            </p>
            <code className="bg-gray-800 px-4 py-2 rounded text-sm text-gray-300">
              curl -X POST https://your-domain/api/setup
            </code>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Pipeline Overview</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <p className="text-sm text-gray-400">Total Prospects</p>
            <p className="text-3xl font-bold mt-1">{data.total_prospects}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <p className="text-sm text-gray-400">Active Trends</p>
            <p className="text-3xl font-bold mt-1">{data.active_trends}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <p className="text-sm text-gray-400">Gap Opportunities</p>
            <p className="text-3xl font-bold mt-1">{data.total_gaps}</p>
          </div>
        </div>

        {/* Tier & Outreach breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Pipeline by Tier
            </h2>
            <div className="space-y-2">
              {Object.entries(TIER_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${TIER_COLORS[key]}`}
                  >
                    {label}
                  </span>
                  <span className="text-lg font-semibold">
                    {data.tier_breakdown[key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Outreach Status
            </h2>
            <div className="space-y-2">
              {["pending", "sent", "replied", "meeting_booked", "declined"].map(
                (status) => (
                  <div key={status} className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
                    >
                      {status.replace("_", " ")}
                    </span>
                    <span className="text-lg font-semibold">
                      {data.outreach_breakdown[status] || 0}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Recent prospects */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Recent Prospects
            </h2>
          </div>
          {data.recent_prospects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No prospects yet. Run /outbound-engine to start scouting.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">EDTP</th>
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3">Outreach</th>
                  <th className="px-5 py-3">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.recent_prospects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/50">
                    <td className="px-5 py-3">
                      <div className="font-medium">{p.company_name}</div>
                      <div className="text-xs text-gray-500">
                        {p.founder_name}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-sm">
                      {p.e_score ?? "-"}/{p.d_score ?? "-"}/{p.t_score ?? "-"}/
                      {p.p_score ?? "-"}
                    </td>
                    <td className="px-5 py-3">
                      {p.tier && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${TIER_COLORS[p.tier]}`}
                        >
                          {TIER_LABELS[p.tier]}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.outreach_status]}`}
                      >
                        {p.outreach_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
