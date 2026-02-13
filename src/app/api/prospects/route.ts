import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name, founder_name, founder_linkedin, website,
      offer_description, price_point, fulfillment_model, trend_thesis,
      e_score, d_score, t_score, p_score, tier,
      outreach_status, outreach_message, outreach_channel,
      notes, source_url,
    } = body;

    if (!company_name) {
      return NextResponse.json({ error: "company_name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO prospects (
        company_name, founder_name, founder_linkedin, website,
        offer_description, price_point, fulfillment_model, trend_thesis,
        e_score, d_score, t_score, p_score, tier,
        outreach_status, outreach_message, outreach_channel,
        notes, source_url
      ) VALUES (
        ${company_name}, ${founder_name || null}, ${founder_linkedin || null}, ${website || null},
        ${offer_description || null}, ${price_point || null}, ${fulfillment_model || null}, ${trend_thesis || null},
        ${e_score || null}, ${d_score || null}, ${t_score || null}, ${p_score || null}, ${tier || null},
        ${outreach_status || "pending"}, ${outreach_message || null}, ${outreach_channel || null},
        ${notes || null}, ${source_url || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create prospect", details: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const outreach_status = searchParams.get("outreach_status");

    let result;
    if (tier && outreach_status) {
      result = await sql`SELECT * FROM prospects WHERE tier = ${tier} AND outreach_status = ${outreach_status} ORDER BY created_at DESC`;
    } else if (tier) {
      result = await sql`SELECT * FROM prospects WHERE tier = ${tier} ORDER BY created_at DESC`;
    } else if (outreach_status) {
      result = await sql`SELECT * FROM prospects WHERE outreach_status = ${outreach_status} ORDER BY created_at DESC`;
    } else {
      result = await sql`SELECT * FROM prospects ORDER BY created_at DESC`;
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prospects", details: String(error) }, { status: 500 });
  }
}
