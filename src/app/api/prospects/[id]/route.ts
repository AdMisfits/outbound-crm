import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const fields: string[] = [];
    const values: unknown[] = [];

    const allowedFields = [
      "company_name", "founder_name", "founder_linkedin", "website",
      "offer_description", "price_point", "fulfillment_model", "trend_thesis",
      "e_score", "d_score", "t_score", "p_score", "tier",
      "outreach_status", "outreach_message", "outreach_channel",
      "notes", "source_url",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        fields.push(field);
        values.push(body[field]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Build dynamic update query
    const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    values.push(id);

    const result = await sql.query(
      `UPDATE prospects SET ${setClauses}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update prospect", details: String(error) }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM prospects WHERE id = ${id}`;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prospect", details: String(error) }, { status: 500 });
  }
}
