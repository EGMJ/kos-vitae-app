CREATE TABLE plataforma.autenticacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE NOT NULL,     
  senha_hash text,
  provedor_oauth text CHECK (provedor_oauth IN ('google','apple')),
  oauth_sub text,
  mfa_secret text,
  ultimo_login_at timestamptz,
  tentativas_falhas int DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE plataforma.preferencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autenticacao_id uuid NOT NULL REFERENCES plataforma.autenticacao(id) ON DELETE CASCADE,
  settings jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE plataforma.sessao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autenticacao_id uuid NOT NULL REFERENCES plataforma.autenticacao(id) ON DELETE CASCADE,
  refresh_token_hash text,
  user_agent text,
  ip inet,
  criado_em timestamptz DEFAULT now(),
  expira_em timestamptz
);

CREATE TABLE plataforma.integracao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autenticacao_id uuid NOT NULL REFERENCES plataforma.autenticacao(id) ON DELETE CASCADE,
  provedor text CHECK (provedor IN ('google_calendar','maps','govbr','icp_brasil')),
  access_token_encrypted text,
  refresh_token_encrypted text,
  scopes text,
  expires_at timestamptz,
  metadata jsonb
);

CREATE TABLE plataforma.documento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text CHECK (tipo IN ('laudo','contrato','foto_ponto','anexo_verificacao','relatorio_assinado')),
  arquivo_url text NOT NULL,
  hash_sha256 text,
  criador_id uuid REFERENCES plataforma.autenticacao(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE plataforma.assinatura (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alvo_tipo text CHECK (alvo_tipo IN ('Timesheet','Relatorio','Atestado','Evolucao')),
  alvo_id uuid NOT NULL,
  tipo text CHECK (tipo IN ('simples','avancada','qualificada')),
  provedor text CHECK (provedor IN ('Gov.br','ICP-Brasil','outro')),
  assinante_id uuid REFERENCES plataforma.autenticacao(id),
  signed_at timestamptz,
  cadeia_cert_json jsonb,
  carimbo_tempo timestamptz
);

CREATE TABLE plataforma.consentimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titular_tipo text,     
  titular_id uuid,       
  tipo text,             
  base_legal text,
  versao_documento text,
  assinado_por_tipo text,  
  assinado_por_id uuid,   
  anon_token text,     
  canal text, metodo text, 
  ip inet, user_agent text,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE plataforma.policy_version (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text,
  versao text,
  conteudo_url text,
  vigencia_inicio date,
  vigencia_fim date
);

CREATE TABLE plataforma.retention_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade text,
  prazo_anos int,
  observacao text
);

CREATE TABLE plataforma.deletion_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade text,
  alvo_id uuid,
  motivo text,
  solicitante_id uuid REFERENCES plataforma.autenticacao(id),
  data_execucao timestamptz,
  status text
);

CREATE TABLE plataforma.professional_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id uuid NOT NULL, 
  crefito_numero text,
  documento_id uuid REFERENCES plataforma.documento(id),
  status text CHECK (status IN ('PENDENTE','VALIDO','VENCIDO')),
  verificado_em timestamptz,
  verificado_por uuid REFERENCES plataforma.autenticacao(id)
);

CREATE TABLE plataforma.notificacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autenticacao_id uuid REFERENCES plataforma.autenticacao(id),
  canal text CHECK (canal IN ('push','email','whatsapp')),
  destinatario text,
  titulo text,
  corpo text,
  status text CHECK (status IN ('fila','enviado','erro')),
  erro_msg text,
  enviado_em timestamptz
);