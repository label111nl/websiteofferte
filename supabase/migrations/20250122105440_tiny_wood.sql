/*
  # Initial Schema Setup for Website Quote Platform

  1. New Tables
    - `users` - Platform users (marketers and admins)
      - `id` (uuid, primary key)
      - `email` (text)
      - `role` (text) - 'admin' or 'marketer'
      - `subscription_type` (text) - 'free', 'premium'
      - `credits_remaining` (int) - For free users
      - `created_at` (timestamp)
    
    - `leads` - Quote requests from customers
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `project_description` (text)
      - `budget_range` (text)
      - `timeline` (text)
      - `max_quotes` (int) - 3 or 5
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `created_at` (timestamp)
    
    - `quotes` - Responses from marketers
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key)
      - `marketer_id` (uuid, foreign key)
      - `price` (decimal)
      - `proposal` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for admin access
    - Policies for marketer access
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'marketer',
  subscription_type text NOT NULL DEFAULT 'free',
  credits_remaining int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'marketer')),
  CONSTRAINT valid_subscription CHECK (subscription_type IN ('free', 'premium'))
);

-- Leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  project_description text NOT NULL,
  budget_range text NOT NULL,
  timeline text NOT NULL,
  max_quotes int NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_max_quotes CHECK (max_quotes IN (3, 5)),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Quotes table
CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  marketer_id uuid REFERENCES users(id),
  price decimal NOT NULL,
  proposal text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policies for leads table
CREATE POLICY "Admins can manage all leads" ON leads
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Marketers can view approved leads" ON leads
  FOR SELECT TO authenticated
  USING (
    status = 'approved' AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'marketer')
  );

-- Policies for quotes table
CREATE POLICY "Marketers can manage own quotes" ON quotes
  FOR ALL TO authenticated
  USING (marketer_id = auth.uid());

CREATE POLICY "Admins can view all quotes" ON quotes
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));