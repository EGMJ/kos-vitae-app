/* ========= plataforma ========= */
ALTER TABLE plataforma.autenticacao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_self_or_admin_read ON plataforma.autenticacao;
CREATE POLICY p_self_or_admin_read ON plataforma.autenticacao
  FOR SELECT
  USING (
    plataforma.app_is_admin()
    OR id = plataforma.app_current_user_id()
  );

DROP POLICY IF EXISTS p_self_or_admin_write ON plataforma.autenticacao;
CREATE POLICY p_self_or_admin_write ON plataforma.autenticacao
  FOR UPDATE
  USING  (plataforma.app_is_admin() OR id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR id = plataforma.app_current_user_id());

-- Preferências: dono ou admin
ALTER TABLE plataforma.preferencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_pref_read  ON plataforma.preferencias FOR SELECT
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());
CREATE POLICY p_pref_write ON plataforma.preferencias FOR ALL
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());

-- Sessões: própria ou admin
ALTER TABLE plataforma.sessao ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_sess_read ON plataforma.sessao FOR SELECT
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());
CREATE POLICY p_sess_manage ON plataforma.sessao FOR ALL
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());

-- Integrações: próprias ou admin
ALTER TABLE plataforma.integracao ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_int_read ON plataforma.integracao FOR SELECT
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());
CREATE POLICY p_int_write ON plataforma.integracao FOR ALL
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());

-- Documento: criador, admin ou vinculado a Ponto do profissional
ALTER TABLE plataforma.documento ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_doc_read ON plataforma.documento FOR SELECT
USING (
  plataforma.app_is_admin()
  OR criador_id = plataforma.app_current_user_id()
  OR EXISTS (
    SELECT 1 FROM operacao.ponto p
    WHERE p.documento_id = documento.id
      AND p.profissional_id = plataforma.app_current_profissional_id()
  )
);
CREATE POLICY p_doc_write ON plataforma.documento FOR ALL
USING (plataforma.app_is_admin() OR criador_id = plataforma.app_current_user_id())
WITH CHECK (plataforma.app_is_admin() OR criador_id = plataforma.app_current_user_id());

-- Assinatura: admin, ou o assinante
ALTER TABLE plataforma.assinatura ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_assin_read ON plataforma.assinatura FOR SELECT
  USING (plataforma.app_is_admin() OR assinante_id = plataforma.app_current_user_id());
CREATE POLICY p_assin_write ON plataforma.assinatura FOR ALL
  USING (plataforma.app_is_admin() OR assinante_id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR assinante_id = plataforma.app_current_user_id());

-- Consentimento: admin; titular logado; quem assinou
ALTER TABLE plataforma.consentimento ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_consent_read ON plataforma.consentimento FOR SELECT
USING (
  plataforma.app_is_admin()
  OR assinado_por_id = plataforma.app_current_user_id()
  OR (
    titular_tipo IN ('Profissional','Responsavel','Paciente')
    AND (
      -- titular coincide com usuário logado em alguma das entidades
      (titular_tipo = 'Profissional' AND EXISTS (
        SELECT 1 FROM clinico.profissional pr
        WHERE pr.autenticacao_id = plataforma.app_current_user_id()
          AND (pr.id)::uuid IS NOT NULL
      ))
      OR (titular_tipo = 'Responsavel' AND EXISTS (
        SELECT 1 FROM clinico.responsavel r
        WHERE r.autenticacao_id = plataforma.app_current_user_id()
      ))
    )
  )
);

-- Policy/Retention/Deletion/Verification/Notificacao: padrões
ALTER TABLE plataforma.policy_version ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_policy_admin ON plataforma.policy_version FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE plataforma.retention_policy ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ret_admin ON plataforma.retention_policy FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE plataforma.deletion_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_delq_admin ON plataforma.deletion_queue FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE plataforma.professional_verification ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_verf_read ON plataforma.professional_verification FOR SELECT
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());
CREATE POLICY p_verf_admin ON plataforma.professional_verification FOR ALL
USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE plataforma.notificacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_notif_read ON plataforma.notificacao FOR SELECT
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());
CREATE POLICY p_notif_write ON plataforma.notificacao FOR ALL
  USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id())
  WITH CHECK (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());

/* ========= clinico ========= */

ALTER TABLE clinico.endereco ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_end_admin ON clinico.endereco FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE clinico.profissional ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_prof_read ON clinico.profissional FOR SELECT
USING (plataforma.app_is_admin() OR id = plataforma.app_current_profissional_id());
CREATE POLICY p_prof_write ON clinico.profissional FOR UPDATE
USING (plataforma.app_is_admin() OR id = plataforma.app_current_profissional_id())
WITH CHECK (plataforma.app_is_admin() OR id = plataforma.app_current_profissional_id());

ALTER TABLE clinico.paciente ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_pac_read ON clinico.paciente FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.paciente_id = paciente.id
               AND a.profissional_id = plataforma.app_current_profissional_id())
  OR EXISTS (SELECT 1 FROM clinico.paciente_responsavel pr
             JOIN clinico.responsavel r ON r.id = pr.responsavel_id
             WHERE pr.paciente_id = paciente.id
               AND r.autenticacao_id = plataforma.app_current_user_id())
);
-- (Opcional: políticas para INSERT/UPDATE por profissionais específicos)

ALTER TABLE clinico.responsavel ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_resp_read ON clinico.responsavel FOR SELECT
USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());
CREATE POLICY p_resp_write ON clinico.responsavel FOR ALL
USING (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id())
WITH CHECK (plataforma.app_is_admin() OR autenticacao_id = plataforma.app_current_user_id());

ALTER TABLE clinico.paciente_responsavel ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_pac_resp_read ON clinico.paciente_responsavel FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM clinico.responsavel r
             WHERE r.id = paciente_responsavel.responsavel_id
               AND r.autenticacao_id = plataforma.app_current_user_id())
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.paciente_id = paciente_responsavel.paciente_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
);

ALTER TABLE clinico.prontuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_pront_read ON clinico.prontuario FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.paciente_id = prontuario.paciente_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
  OR EXISTS (SELECT 1 FROM clinico.paciente_responsavel pr
             JOIN clinico.responsavel r ON r.id = pr.responsavel_id
             WHERE pr.paciente_id = prontuario.paciente_id
               AND r.autenticacao_id = plataforma.app_current_user_id())
);

ALTER TABLE clinico.evolucao_prontuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ev_read ON clinico.evolucao_prontuario FOR SELECT
USING (
  plataforma.app_is_admin()
  OR profissional_id = plataforma.app_current_profissional_id()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.id = evolucao_prontuario.atendimento_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
  OR EXISTS (SELECT 1 FROM clinico.paciente_responsavel pr
             JOIN clinico.prontuario p ON p.id = evolucao_prontuario.prontuario_id
             JOIN clinico.responsavel r ON r.id = pr.responsavel_id
             WHERE pr.paciente_id = p.paciente_id
               AND r.autenticacao_id = plataforma.app_current_user_id())
);

/* ========= operacao ========= */

ALTER TABLE operacao.agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_agenda_read ON operacao.agenda FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.id = agenda.atendimento_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
);

ALTER TABLE operacao.atendimento ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_atend_read ON operacao.atendimento FOR SELECT
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());

ALTER TABLE operacao.ponto ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ponto_read ON operacao.ponto FOR SELECT
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());
CREATE POLICY p_ponto_write ON operacao.ponto FOR ALL
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id())
WITH CHECK (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());

ALTER TABLE operacao.rota ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rota ON operacao.rota FOR SELECT
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());

ALTER TABLE operacao.rota_parada ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rota_parada ON operacao.rota_parada FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.rota r
             WHERE r.id = rota_parada.rota_id
               AND r.profissional_id = plataforma.app_current_profissional_id())
);

ALTER TABLE operacao.rota_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rota_log ON operacao.rota_log FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.rota r
             WHERE r.id = rota_log.rota_id
               AND r.profissional_id = plataforma.app_current_profissional_id())
);

ALTER TABLE plataforma.timesheet ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_timesheet ON plataforma.timesheet FOR SELECT
USING (plataforma.app_is_admin() OR profissional_id = plataforma.app_current_profissional_id());

/* ========= financeiro ========= */

ALTER TABLE financeiro.convenio ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_conv_admin ON financeiro.convenio FOR ALL
USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE financeiro.plano_convenio ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_plano_admin ON financeiro.plano_convenio FOR ALL
USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE financeiro.paciente_convenio ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_pac_conv_read ON financeiro.paciente_convenio FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.paciente_id = paciente_convenio.paciente_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
  OR EXISTS (SELECT 1 FROM clinico.paciente_responsavel pr
             JOIN clinico.responsavel r ON r.id = pr.responsavel_id
             WHERE pr.paciente_id = paciente_convenio.paciente_id
               AND r.autenticacao_id = plataforma.app_current_user_id())
);

ALTER TABLE financeiro.financeiro_titulo ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ft_read ON financeiro.financeiro_titulo FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM operacao.atendimento a
             WHERE a.id = financeiro_titulo.atendimento_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
);
ALTER TABLE financeiro.lancamento_financeiro ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_lcto_read ON financeiro.lancamento_financeiro FOR SELECT
USING (
  plataforma.app_is_admin()
  OR EXISTS (SELECT 1 FROM financeiro.financeiro_titulo t
             JOIN operacao.atendimento a ON a.id = t.atendimento_id
             WHERE t.id = lancamento_financeiro.titulo_id
               AND a.profissional_id = plataforma.app_current_profissional_id())
);

/* ========= admin ========= */

ALTER TABLE admin.role ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_role_admin ON admin.role FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.permission ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_perm_admin ON admin.permission FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.user_role ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_urole_admin ON admin.user_role FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.role_permission ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rp_admin ON admin.role_permission FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.access_event ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_audit_admin ON admin.access_event FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.break_glass_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_bga_admin ON admin.break_glass_access FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.security_setting ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_sec_admin ON admin.security_setting FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());

ALTER TABLE admin.incident ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_inc_admin ON admin.incident FOR ALL USING (plataforma.app_is_admin()) WITH CHECK (plataforma.app_is_admin());



-- > **Conceitos**:
-- >
-- > * Ative RLS na tabela com `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. (Doc: RLS/CREATE POLICY) ([PostgreSQL][5])
-- > * **USING** limita linhas *visíveis* (SELECT/DELETE/UPDATE). **WITH CHECK** limita linhas *inseridas/atualizadas* (INSERT/UPDATE). ([PostgreSQL][6])
-- > * Você pode ter várias *policies* por tabela; por padrão elas são **permissive** (OR lógico). (Doc) ([PostgreSQL][5])
