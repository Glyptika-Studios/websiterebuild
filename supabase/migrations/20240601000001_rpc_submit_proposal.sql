CREATE OR REPLACE FUNCTION submit_proposal(
  p_name                TEXT,
  p_email               TEXT,
  p_phone               TEXT              DEFAULT NULL,
  p_company             TEXT              DEFAULT NULL,
  p_subject             TEXT              DEFAULT NULL,
  p_message             TEXT              DEFAULT NULL,
  p_budget_type         budget_type       DEFAULT NULL,
  p_budget_min          NUMERIC           DEFAULT NULL,
  p_budget_max          NUMERIC           DEFAULT NULL,
  p_budget_label        TEXT              DEFAULT NULL,
  p_source_product_id   UUID              DEFAULT NULL,
  p_source_service_id   UUID              DEFAULT NULL,
  p_source_project_id   UUID              DEFAULT NULL,
  p_priority            proposal_priority DEFAULT 'normal',
  p_source_channel      proposal_channel  DEFAULT NULL,
  p_service_ids         UUID[]            DEFAULT '{}',
  p_product_ids         UUID[]            DEFAULT '{}',
  p_project_ids         UUID[]            DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_proposal_id UUID;
BEGIN
  INSERT INTO proposals (
    name, email, phone, company, subject, message,
    budget_type, budget_min, budget_max, budget_label,
    source_product_id, source_service_id, source_project_id,
    priority, source_channel
  ) VALUES (
    p_name, p_email, p_phone, p_company, p_subject, p_message,
    p_budget_type, p_budget_min, p_budget_max, p_budget_label,
    p_source_product_id, p_source_service_id, p_source_project_id,
    p_priority, p_source_channel
  )
  RETURNING id INTO v_proposal_id;

  INSERT INTO proposal_services (proposal_id, service_id)
  SELECT v_proposal_id, unnest(p_service_ids)
  WHERE cardinality(p_service_ids) > 0;

  INSERT INTO proposal_products (proposal_id, product_id)
  SELECT v_proposal_id, unnest(p_product_ids)
  WHERE cardinality(p_product_ids) > 0;

  INSERT INTO proposal_projects (proposal_id, project_id)
  SELECT v_proposal_id, unnest(p_project_ids)
  WHERE cardinality(p_project_ids) > 0;

  RETURN v_proposal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION submit_proposal TO anon;
GRANT EXECUTE ON FUNCTION submit_proposal TO authenticated;
