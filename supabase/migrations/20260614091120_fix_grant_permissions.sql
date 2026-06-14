-- Grant basic table permissions to Supabase roles
-- RLS policies handle row-level filtering on top of these grants
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Also grant sequence permissions for inserts
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
