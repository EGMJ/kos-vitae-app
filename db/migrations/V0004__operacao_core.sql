CREATE TABLE operacao.agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atendimento_id uuid,
  titulo text,
  inicio timestamptz NOT NULL,
  fim timestamptz NOT NULL,
  rrule text,
  notificar boolean DEFAULT false,
  cor text, observacao text
);

CREATE TABLE operacao.atendimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES clinico.paciente(id),
  profissional_id uuid NOT NULL REFERENCES clinico.profissional(id),
  local_endereco_id uuid REFERENCES clinico.endereco(id),
  inicio timestamptz NOT NULL,
  duracao_min int NOT NULL,
  status text DEFAULT 'agendado' CHECK (status IN ('agendado','em_andamento','concluido','cancelado','no_show'))
);

ALTER TABLE operacao.agenda
  ADD CONSTRAINT agenda_atendimento_fk FOREIGN KEY (atendimento_id) REFERENCES operacao.atendimento(id) ON DELETE SET NULL;

CREATE TABLE operacao.ponto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atendimento_id uuid NOT NULL REFERENCES operacao.atendimento(id) ON DELETE CASCADE,
  profissional_id uuid NOT NULL REFERENCES clinico.profissional(id),
  tipo text NOT NULL CHECK (tipo IN ('checkin','pausa','checkout')),
  timestamp timestamptz NOT NULL,
  lat numeric(9,6), lon numeric(9,6), precisao_m numeric(8,2),
  dispositivo_id text, observacao text,
  documento_id uuid REFERENCES plataforma.documento(id)  
);

CREATE TABLE operacao.rota (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id uuid NOT NULL REFERENCES clinico.profissional(id),
  data date NOT NULL,
  dist_total_km numeric(6,2), tempo_estimado_min int
);

CREATE TABLE operacao.rota_parada (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rota_id uuid NOT NULL REFERENCES operacao.rota(id) ON DELETE CASCADE,
  ordem smallint NOT NULL,
  endereco_id uuid NOT NULL REFERENCES clinico.endereco(id),
  paciente_id uuid REFERENCES clinico.paciente(id),
  eta_min int,
  observacao text,
  UNIQUE (rota_id, ordem)
);

CREATE TABLE operacao.rota_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rota_id uuid NOT NULL REFERENCES operacao.rota(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  lat numeric(9,6), lon numeric(9,6), precisao_m numeric(8,2)
);

CREATE TABLE plataforma.timesheet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id uuid NOT NULL REFERENCES clinico.profissional(id),
  competencia date NOT NULL,
  minutos_trabalhados int,
  qtde_atendimentos int,
  pdf_documento_id uuid REFERENCES plataforma.documento(id)
);
