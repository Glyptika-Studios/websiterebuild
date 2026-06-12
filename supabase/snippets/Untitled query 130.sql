GRANT SELECT ON positions TO anon;
GRANT SELECT ON position_items TO anon;
GRANT SELECT ON positions TO authenticated;
GRANT SELECT ON position_items TO authenticated;
ALTER TABLE positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE position_items DISABLE ROW LEVEL SECURITY;