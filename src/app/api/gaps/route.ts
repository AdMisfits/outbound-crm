import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trend_thesis_id, gap_description, market_evidence, potential_offer_concept, estimated_ticket_size, status } = body;

    if (!gap_description) {
      return NextResponse.json({ error: "gap_description is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO gap_opportunities (trend_thesis_id, gap_description, market_evidence, potential_offer_concept, estimated_ticket_size, status)
      VALUES (
        ${trend_thesis_id || null},
        ${gap_description},
        ${market_evidence || null},
        ${potential_offer_concept || null},
        ${estimated_ticket_size || null},
        ${status || "identified"}
      )
      RETURNING *
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create gap", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT g.*, t.trend_name
      FROM gap_opportunities g
      LEFT JOIN trend_theses t ON g.trend_thesis_id = t.id
      ORDER BY g.created_at DESC
    `;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gaps", details: String(error) }, { status: 500 });
  }
}
