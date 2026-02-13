import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trend_name, description, evidence, intersections, status } = body;

    if (!trend_name) {
      return NextResponse.json({ error: "trend_name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO trend_theses (trend_name, description, evidence, intersections, status)
      VALUES (
        ${trend_name},
        ${description || null},
        ${JSON.stringify(evidence || [])},
        ${JSON.stringify(intersections || [])},
        ${status || "active"}
      )
      RETURNING *
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trend", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT * FROM trend_theses ORDER BY created_at DESC`;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trends", details: String(error) }, { status: 500 });
  }
}
