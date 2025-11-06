-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_autenticacao_email ON plataforma.autenticacao (email);
CREATE INDEX IF NOT EXISTS idx_profissional_cpf ON clinico.profissional (cpf);
CREATE INDEX IF NOT EXISTS idx_paciente_cpf ON clinico.paciente (cpf);
CREATE INDEX IF NOT EXISTS idx_atendimento_inicio ON operacao.atendimento (inicio);
CREATE INDEX IF NOT EXISTS idx_fin_titulo_competencia ON financeiro.financeiro_titulo (competencia);
CREATE INDEX IF NOT EXISTS idx_fin_titulo_status ON financeiro.financeiro_titulo (status);
CREATE INDEX IF NOT EXISTS idx_ponto_timestamp ON operacao.ponto (timestamp);

-- Busca aproximada (pg_trgm) em nomes
CREATE INDEX IF NOT EXISTS gin_paciente_nome_trgm ON clinico.paciente USING gin (nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_profissional_nome_trgm ON clinico.profissional USING gin (nome gin_trgm_ops);
