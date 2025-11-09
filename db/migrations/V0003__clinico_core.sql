CREATE TABLE clinico.endereco (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logradouro text, numero text, complemento text,
  bairro text, cidade text, uf char(2), cep char(8),
  lat numeric(9,6), lon numeric(9,6)
);

CREATE TABLE clinico.profissional (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autenticacao_id uuid UNIQUE REFERENCES plataforma.autenticacao(id) ON DELETE SET NULL,
  nome text NOT NULL,
  cpf char(11) UNIQUE,
  crefito_numero text,
  telefone_e164 varchar(16),
  email citext,
  endereco_id uuid REFERENCES clinico.endereco(id),
  foto_url text,
  status_verificacao text,
  data_nascimento date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE clinico.paciente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf char(11) UNIQUE,
  data_nascimento date,
  sexo text,
  telefone_e164 varchar(16),
  email citext,
  endereco_id uuid REFERENCES clinico.endereco(id),
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE clinico.responsavel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf char(11) UNIQUE,
  telefone_e164 varchar(16),
  email citext,
  endereco_id uuid REFERENCES clinico.endereco(id),
  autenticacao_id uuid REFERENCES plataforma.autenticacao(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE clinico.paciente_responsavel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES clinico.paciente(id) ON DELETE CASCADE,
  responsavel_id uuid NOT NULL REFERENCES clinico.responsavel(id) ON DELETE CASCADE,
  tipo_vinculo text,                  
  representacao_legal boolean DEFAULT true,
  inicio_vigencia date,
  fim_vigencia date,
  observacoes text,
  UNIQUE (paciente_id, responsavel_id)
);

CREATE TABLE clinico.prontuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES clinico.paciente(id) ON DELETE CASCADE,
  profissional_responsavel_id uuid REFERENCES clinico.profissional(id),
  problema_resumo text, alergias text, objetivos text, plano_resumo text,
  sigilo boolean DEFAULT true
);

CREATE TABLE clinico.evolucao_prontuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prontuario_id uuid NOT NULL REFERENCES clinico.prontuario(id) ON DELETE CASCADE,
  atendimento_id uuid, 
  profissional_id uuid REFERENCES clinico.profissional(id),
  anamnese text, avaliacao text, diagnostico text, intervencao text, evolucao text,
  registrado_em timestamptz DEFAULT now(),
  assinatura_id uuid REFERENCES plataforma.assinatura(id)
);

