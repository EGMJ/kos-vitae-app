CREATE OR REPLACE FUNCTION plataforma.app_current_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION plataforma.app_current_profissional_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.current_profissional_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION plataforma.app_current_responsavel_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.current_responsavel_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION plataforma.app_is_admin() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT COALESCE(current_setting('app.current_is_admin', true), 'false')::boolean
$$;