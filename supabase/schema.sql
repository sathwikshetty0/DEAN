-- ─────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'responder', 'admin')) DEFAULT 'user',

  -- Responder specific
  skills TEXT[] DEFAULT '{}',
  zone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,

  -- Last known location
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_updated_at TIMESTAMPTZ,

  -- Stats
  total_alerts_sent INTEGER DEFAULT 0,
  total_alerts_responded INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────
-- ALERTS
-- ─────────────────────────────────────
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_code TEXT UNIQUE NOT NULL,         -- e.g. DEAN-4821

  triggered_by UUID NOT NULL REFERENCES profiles(id),

  -- Location
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  location_address TEXT,

  emergency_type TEXT NOT NULL 
    CHECK (emergency_type IN ('medical','fire','accident','crime','flood','other')),

  description TEXT CHECK (char_length(description) <= 500),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','en_route','resolved','cancelled')),

  routing_mode TEXT NOT NULL CHECK (routing_mode IN ('cloud','p2p')),

  priority TEXT DEFAULT 'high'
    CHECK (priority IN ('low','medium','high','critical')),

  assigned_responder UUID REFERENCES profiles(id),

  responder_lat DOUBLE PRECISION,
  responder_lng DOUBLE PRECISION,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  en_route_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  is_synced BOOLEAN DEFAULT TRUE           -- FALSE = was P2P, pending DB sync
);

-- Auto-generate alert_code (DEAN-XXXX)
CREATE SEQUENCE alert_seq START 1000;
CREATE OR REPLACE FUNCTION generate_alert_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.alert_code := 'DEAN-' || LPAD(nextval('alert_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_alert_code
  BEFORE INSERT ON alerts
  FOR EACH ROW EXECUTE FUNCTION generate_alert_code();

-- ─────────────────────────────────────
-- ALERT TIMELINE (audit trail)
-- ─────────────────────────────────────
CREATE TABLE alert_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  actor_role TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- LOGS
-- ─────────────────────────────────────
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES alerts(id),
  alert_code TEXT,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  actor_role TEXT,
  routing_mode TEXT CHECK (routing_mode IN ('cloud','p2p')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own, responders see all, admin sees all
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Responders read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('responder','admin'))
  );

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Alerts: users see own, responders see all pending+active, admin sees all
CREATE POLICY "Users see own alerts" ON alerts
  FOR SELECT USING (triggered_by = auth.uid());

CREATE POLICY "Responders see all alerts" ON alerts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('responder','admin'))
  );

CREATE POLICY "Users create alerts" ON alerts
  FOR INSERT WITH CHECK (triggered_by = auth.uid());

CREATE POLICY "Responders update alerts" ON alerts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('responder','admin'))
  );

-- Logs: admin only
CREATE POLICY "Admin reads logs" ON logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
