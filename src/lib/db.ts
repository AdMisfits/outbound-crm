import { sql } from "@vercel/postgres";

export { sql };

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS prospects (
      id SERIAL PRIMARY KEY,
      company_name TEXT NOT NULL,
      founder_name TEXT,
      founder_linkedin TEXT,
      website TEXT,
      offer_description TEXT,
      price_point TEXT,
      fulfillment_model TEXT,
      trend_thesis TEXT,
      e_score INTEGER CHECK (e_score >= 1 AND e_score <= 5),
      d_score INTEGER CHECK (d_score >= 1 AND d_score <= 5),
      t_score INTEGER CHECK (t_score >= 1 AND t_score <= 5),
      p_score INTEGER CHECK (p_score >= 1 AND p_score <= 5),
      tier TEXT CHECK (tier IN ('decline', '10pct', '40pct', '70_30')),
      outreach_status TEXT DEFAULT 'pending' CHECK (outreach_status IN ('pending', 'sent', 'replied', 'meeting_booked', 'declined')),
      outreach_message TEXT,
      outreach_channel TEXT CHECK (outreach_channel IN ('linkedin', 'email')),
      notes TEXT,
      source_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trend_theses (
      id SERIAL PRIMARY KEY,
      trend_name TEXT NOT NULL,
      description TEXT,
      evidence JSONB DEFAULT '[]'::jsonb,
      intersections JSONB DEFAULT '[]'::jsonb,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'exploring', 'archived')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gap_opportunities (
      id SERIAL PRIMARY KEY,
      trend_thesis_id INTEGER REFERENCES trend_theses(id),
      gap_description TEXT NOT NULL,
      market_evidence TEXT,
      potential_offer_concept TEXT,
      estimated_ticket_size TEXT,
      status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'researching', 'building', 'launched')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}
