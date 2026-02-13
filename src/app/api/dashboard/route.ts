import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const [prospects, trends, gaps, tierBreakdown, outreachBreakdown, recentProspects] =
      await Promise.all([
        sql`SELECT COUNT(*) as count FROM prospects`,
        sql`SELECT COUNT(*) as count FROM trend_theses WHERE status = 'active'`,
        sql`SELECT COUNT(*) as count FROM gap_opportunities`,
        sql`
          SELECT tier, COUNT(*) as count
          FROM prospects
          GROUP BY tier
          ORDER BY CASE tier
            WHEN '70_30' THEN 1
            WHEN '40pct' THEN 2
            WHEN '10pct' THEN 3
            WHEN 'decline' THEN 4
          END
        `,
        sql`
          SELECT outreach_status, COUNT(*) as count
          FROM prospects
          GROUP BY outreach_status
        `,
        sql`SELECT * FROM prospects ORDER BY created_at DESC LIMIT 5`,
      ]);

    return NextResponse.json({
      total_prospects: parseInt(prospects.rows[0].count),
      active_trends: parseInt(trends.rows[0].count),
      total_gaps: parseInt(gaps.rows[0].count),
      tier_breakdown: tierBreakdown.rows.reduce(
        (acc, row) => {
          acc[row.tier as string] = parseInt(row.count as string);
          return acc;
        },
        {} as Record<string, number>
      ),
      outreach_breakdown: outreachBreakdown.rows.reduce(
        (acc, row) => {
          acc[row.outreach_status as string] = parseInt(row.count as string);
          return acc;
        },
        {} as Record<string, number>
      ),
      recent_prospects: recentProspects.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: String(error) },
      { status: 500 }
    );
  }
}
