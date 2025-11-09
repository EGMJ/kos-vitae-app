CREATE TABLE financeiro.convenio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnpj char(14),
  contato text, telefone_e164 varchar(16), email citext
);

CREATE TABLE financeiro.plano_convenio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES financeiro.convenio(id) ON DELETE CASCADE,
  nome text NOT NULL,
  codigo_plano text,
  regras_glosa jsonb
);

CREATE TABLE financeiro.paciente_convenio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES clinico.paciente(id) ON DELETE CASCADE,
  plano_id uuid NOT NULL REFERENCES financeiro.plano_convenio(id) ON DELETE CASCADE,
  numero_carteira text,
  validade date,
  UNIQUE (paciente_id, plano_id)
);

CREATE TABLE financeiro.financeiro_titulo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origem text NOT NULL CHECK (origem IN ('atendimento','pacote')),
  atendimento_id uuid REFERENCES operacao.atendimento(id),
  paciente_id uuid REFERENCES clinico.paciente(id),
  convenio_id uuid REFERENCES financeiro.convenio(id),
  competencia date NOT NULL,
  prev_recebimento date,
  valor_bruto numeric(12,2) NOT NULL,
  descontos numeric(12,2) DEFAULT 0,
  valor_liquido numeric(12,2),
  status text DEFAULT 'aberto' CHECK (status IN ('aberto','parcial','pago')),
  recebido_em date,
  nfse_numero text
);

CREATE TABLE financeiro.lancamento_financeiro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_id uuid NOT NULL REFERENCES financeiro.financeiro_titulo(id) ON DELETE CASCADE,
  valor numeric(12,2) NOT NULL,
  data date NOT NULL,
  tipo text CHECK (tipo IN ('baixa','glosa','ajuste')),
  observacao text
);
