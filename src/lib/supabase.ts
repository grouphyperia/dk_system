import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: string;
  oab_number?: string;
  specializations?: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  permissions?: string[];
  joined_at: string;
  organization?: Organization;
  profile?: Profile;
}

export interface Client {
  id: string;
  organization_id: string;
  type: 'individual' | 'company';
  name: string;
  email?: string;
  phone?: string;
  document_number?: string;
  address?: any;
  notes?: string;
  status: 'active' | 'inactive' | 'archived';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  organization_id: string;
  client_id: string;
  case_number: string;
  title: string;
  description?: string;
  case_type: string;
  practice_area?: string;
  court_instance?: string;
  court_name?: string;
  process_number?: string;
  status: 'open' | 'in_progress' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_value?: number;
  responsible_lawyer_id?: string;
  assigned_lawyers?: string[];
  start_date?: string;
  expected_end_date?: string;
  actual_end_date?: string;
  billing_rate?: number;
  billing_type: 'hourly' | 'fixed' | 'contingency';
  created_by?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  responsible_lawyer?: Profile;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  organization_id: string;
  name: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  document_type?: string;
  is_confidential: boolean;
  tags?: string[];
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseActivity {
  id: string;
  case_id: string;
  organization_id: string;
  user_id?: string;
  activity_type: string;
  title: string;
  description?: string;
  metadata?: any;
  created_at: string;
  user?: Profile;
}
