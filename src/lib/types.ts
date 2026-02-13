export interface Prospect {
  id: number;
  company_name: string;
  founder_name: string | null;
  founder_linkedin: string | null;
  website: string | null;
  offer_description: string | null;
  price_point: string | null;
  fulfillment_model: string | null;
  trend_thesis: string | null;
  e_score: number | null;
  d_score: number | null;
  t_score: number | null;
  p_score: number | null;
  tier: "decline" | "10pct" | "40pct" | "70_30" | null;
  outreach_status: "pending" | "sent" | "replied" | "meeting_booked" | "declined";
  outreach_message: string | null;
  outreach_channel: "linkedin" | "email" | null;
  notes: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrendThesis {
  id: number;
  trend_name: string;
  description: string | null;
  evidence: { source: string; data_point: string }[];
  intersections: { trends: string[]; opportunity: string }[];
  status: "active" | "exploring" | "archived";
  created_at: string;
}

export interface GapOpportunity {
  id: number;
  trend_thesis_id: number | null;
  trend_name: string | null;
  gap_description: string;
  market_evidence: string | null;
  potential_offer_concept: string | null;
  estimated_ticket_size: string | null;
  status: "identified" | "researching" | "building" | "launched";
  created_at: string;
}

export interface DashboardData {
  total_prospects: number;
  active_trends: number;
  total_gaps: number;
  tier_breakdown: Record<string, number>;
  outreach_breakdown: Record<string, number>;
  recent_prospects: Prospect[];
}
