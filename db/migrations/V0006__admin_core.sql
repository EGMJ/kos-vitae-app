CREATE TABLE admin.role (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,   
  descricao text,
  escopos jsonb
);

CREATE TABLE admin.permission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  descricao text
);

CREATE TABLE admin.user_role (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES plataforma.autenticacao(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES admin.role(id) ON DELETE CASCADE,
  atribuido_por uuid REFERENCES plataforma.autenticacao(id),
  atribuido_em timestamptz,
  UNIQUE (usuario_id, role_id)
);

CREATE TABLE admin.role_permission (
  role_id uuid NOT NULL REFERENCES admin.role(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES admin.permission(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE admin.access_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES plataforma.autenticacao(id),
  alvo_tipo text,
  alvo_id uuid,
  acao text CHECK (acao IN ('VIEW','EXPORT','UPDATE','DELETE')),
  resultado text CHECK (resultado IN ('ALLOW','DENY')),
  timestamp timestamptz DEFAULT now(),
  ip inet, user_agent text
);

CREATE TABLE admin.break_glass_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES plataforma.autenticacao(id),
  paciente_id uuid REFERENCES clinico.paciente(id),
  prontuario_id uuid REFERENCES clinico.prontuario(id),
  motivo text, processo_ref text,
  janela_inicio timestamptz, janela_fim timestamptz,
  status text CHECK (status IN ('ABERTO','APROVADO','ENCERRADO')),
  aprovado_por uuid REFERENCES plataforma.autenticacao(id)
);

CREATE TABLE admin.security_setting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_policy jsonb,
  mfa_obrigatorio boolean,
  session_timeout_min int,
  ip_allowlist jsonb
);

CREATE TABLE admin.incident (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text, gravidade text, detalhe text,
  aberto_em timestamptz, fechado_em timestamptz
);
