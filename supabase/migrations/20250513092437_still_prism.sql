/*
  # Create users table with RLS policies

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `username` (text, unique)
      - `password` (text)
      - `role` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `users` table
    - Add policies for:
      - Authenticated users can read all users
      - Only admins can create/update/delete users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL,
  permissions jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert admin user
INSERT INTO users (
  first_name,
  last_name,
  username,
  password,
  role,
  permissions
) VALUES (
  'Admin',
  'Admin',
  'admin.admin',
  'admingenerico',
  'admin',
  '{
    "createProjects": true,
    "editProjects": true,
    "deleteProjects": true,
    "downloadReports": true,
    "createUsers": true,
    "editUsers": true,
    "deleteUsers": true,
    "createTests": true,
    "editTests": true,
    "deleteTests": true,
    "createStock": true,
    "editStock": true,
    "deleteStock": true
  }'::jsonb
) ON CONFLICT (username) DO NOTHING;