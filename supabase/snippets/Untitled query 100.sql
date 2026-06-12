CREATE POLICY "public_read_positions"
  ON positions FOR SELECT TO anon, authenticated
  USING (active = true);