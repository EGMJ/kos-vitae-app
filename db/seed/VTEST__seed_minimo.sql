INSERT INTO admin.role (id, nome) VALUES (gen_random_uuid(), 'admin') ON CONFLICT DO NOTHING;

-- Usuário admin
WITH u AS (
  INSERT INTO plataforma.autenticacao (email, senha_hash, ativo)
  VALUES ('admin@kosvitae.app', '***hash***', true)
  RETURNING id
)
INSERT INTO admin.user_role (usuario_id, role_id)
SELECT u.id, r.id
FROM u JOIN admin.role r ON r.nome = 'admin';

-- Profissional e paciente de exemplo
INSERT INTO plataforma.autenticacao (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'fisio@ex.com')
  ON CONFLICT DO NOTHING;

INSERT INTO clinico.profissional (id, autenticacao_id, nome)
VALUES ('00000000-0000-0000-0000-0000000000AA', '00000000-0000-0000-0000-000000000001', 'Fisio Demo')
ON CONFLICT DO NOTHING;

INSERT INTO clinico.paciente (nome) VALUES ('Paciente Demo') ON CONFLICT DO NOTHING;