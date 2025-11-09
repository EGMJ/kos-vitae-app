# 1) Estrutura de diretórios 

```plaintext
db/
  flyway.dev.conf
  flyway.base.conf
  init/
    010_healthcheck.sql
    post-create.sh
  migrations/
    V0001__bootstrap_schemas_and_extensions.sql
    V0002__plataforma_core.sql
    V0003__clinico_core.sql
    V0004__operacao_core.sql
    V0005__financeiro_core.sql
    V0006__admin_core.sql
    V0007__indexes_and_constraints.sql
    V0008__rls_helpers.sql
    V0009__rls_policies.sql
  repeatable/
    R__views_and_functions.sql
  seed/
    VTEST__seed_minimo.sql
  tests/
    00_bootstrap/
      000_plan_basico.sql
    10_estrutura/
      101_schemas.sql
      102_tabelas_basicas.sql
      103_colunas_tipos_plataforma.sql
      104_indices_unicos_e_checks.sql
    20_constraints_fk/
      201_fk_clinico.sql
      202_fk_operacao.sql
      203_fk_financeiro.sql
    30_rls_policies/
      301_rls_paciente.sql
      302_rls_prontuario.sql
      303_rls_ponto.sql
    40_fluxos_criticos/
      401_fluxo_cadastro_profissional.sql
      402_fluxo_vinculo_paciente_responsavel.sql
      403_fluxo_ponto_entrada_saida.sql
      404_fluxo_rotas_do_dia.sql
      405_fluxo_financeiro_consolidado.sql
  docs/
    der.dbml
```



***

Perfeito — vou te entregar um **pacote Flyway** completo (schemas, extensões, tabelas, *helpers* e **RLS para todas as tabelas**), e depois explico com cuidado **como funcionam as políticas (USING vs WITH CHECK, permissive/restrictive)**, por que estou usando **`citext`** para e-mail, **UUID**, *session variables* via `current_setting`, e outras boas práticas de segurança — tudo com referências oficiais do PostgreSQL.

> Observação: nos exemplos abaixo, o app deve **setar 4 variáveis de sessão** após autenticar o usuário:
> `app.current_user_id`, `app.current_profissional_id`, `app.current_responsavel_id`, `app.current_is_admin` (`'true'|'false'`). As políticas leem essas variáveis com `current_setting(..., true)`. (Doc de `current_setting`: ([PostgreSQL][1]))

---

# 1) Estrutura de diretórios (Flyway)


---

# 2) Migrações

## V0001__bootstrap_schemas_and_extensions.sql

```sql

```



---

## V0002__plataforma_core.sql

```sql

```

---

## V0003__clinico_core.sql

---

## V0004__operacao_core.sql

---

## V0005__financeiro_core.sql

---

## V0006__admin_core.sql

---

## V0007__indexes_and_constraints.sql

---

## V0008__rls_helpers.sql

---

## V0009__rls_policies.sql


---

# 3) Como o app deve **setar as variáveis** (exemplo)

No início de **cada conexão** (ou logo após o login), o backend define:

```sql
-- exemplo de bootstrap de sessão de um profissional (não-admin)
SET app.current_is_admin = 'false';
SET app.current_user_id = '00000000-0000-0000-0000-000000000001';
SET app.current_profissional_id = '00000000-0000-0000-0000-0000000000AA';
RESET app.current_responsavel_id;  -- se não for responsável logado
```

Essas variáveis são lidas pelas políticas com `current_setting('app.current_*', true)`. (Doc: `current_setting`) ([PostgreSQL][1])

---

# 4) Como as **RLS policies** funcionam (em português simples)

* **Habilitar RLS**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` ativa o mecanismo. Sem isso as *policies* não têm efeito. ([PostgreSQL][5])
* **CREATE POLICY**: você cria regras por operação (**SELECT/INSERT/UPDATE/DELETE** ou **ALL**).

  * **USING (condição)**: quais linhas ficam **visíveis** para o papel/usuário.
  * **WITH CHECK (condição)**: quais linhas podem ser **inseridas/atualizadas**. (Ex.: só posso dar `UPDATE` em linhas “minhas”). ([PostgreSQL][6])
* **Várias policies** somam (comportamento **permissive**, “OU”). Você pode ajustar com `AS RESTRICTIVE` quando quiser interseção (“E”). ([PostgreSQL][6])
* **Por que variáveis de sessão?** Avaliar *quem é o usuário* e *qual profissional está atuando* sem ler tabelas sensíveis dentro da policy evita recursão/overhead. (Doc `current_setting`) ([PostgreSQL][1])
* **Defesa em profundidade**: RLS protege até se alguém bater direto no DB (ex.: *read-only replica*) ou via ferramentas de terceiros. ([Supabase][7])

---

# 5) Boas práticas que adotamos (com referências)

* **`citext` para e-mails/usuários**: unicidade e comparação *case-insensitive* sem precisar de `LOWER()` nos índices. ([PostgreSQL][2])
* **UUID** por padrão: `gen_random_uuid()` (pgcrypto) ou `uuid_generate_v4()` (uuid-ossp). Ambos amplamente usados; habilite a extensão correspondente. ([PostgreSQL][3])
* **Text search amigável**: `pg_trgm` + GIN para busca aproximada em nomes. ([PostgreSQL][4])
* **Migrations**: versionar com Flyway (SQL puro). (Você pode usar Liquibase se preferir *diffs/rollback* descritivos.)
* **Grants mínimos** e **RLS em todas as tabelas** (exceto catálogos): o app não depende de confiar no ORM.
* **Auditoria** (`admin.access_event`) e **break-glass** (`admin.break_glass_access`) para acessos excepcionais a prontuário (toda leitura sensível deve gerar log).

---

# 6) Seeds mínimos (opcional)

## VTEST__seed_minimo.sql (recorte)

---

## 7) Observações finais (segurança & performance)

* **RLS + índices**: Como as políticas fazem muitos `EXISTS` por FKs (`profissional_id`, `paciente_id`, etc.), **garanta índices** nessas colunas (já criamos os principais).
* **Cuidado com funções `SECURITY DEFINER`** em políticas (evitamos ler tabelas dentro das policies). Mantivemos *helpers* só com `current_setting`.
* **Admin**: mesmo “admin” **não** ignora RLS automaticamente; ele passa porque a *policy* inclui `app_is_admin()`. (Superusuário de banco ignora tudo, mas o app **não** deve usar superuser.)

---

Se quiser, eu já **empacoto** esses arquivos (*V0001…V0009* + *seed*) no formato que você usa e, se preferir, adiciono uma **R__view** para cada *join* comum (ex.: *view* de “Atendimentos do meu dia”).
Qualquer ponto acima que você queira adaptar (por exemplo, permitir que **Responsável** veja *Agenda* do paciente), a gente só acrescenta mais uma *policy* específica e pronto.

**Referências (PostgreSQL docs e guias):**
RLS/CREATE POLICY e conceitos gerais. ([PostgreSQL][5])
`current_setting` e parâmetros de sessão. ([PostgreSQL][1])
`citext` (case-insensitive). ([PostgreSQL][2])
`pgcrypto` (UUID v4: `gen_random_uuid`). ([PostgreSQL][3])
`uuid-ossp` (alternativa `uuid_generate_v4`). ([PostgreSQL][8])
`pg_trgm` (busca por similaridade). ([PostgreSQL][4])
Guia prático de RLS (visões adicionais). ([Supabase][7])

Se quiser, já te mando um **cheatsheet** de *SET* das variáveis por perfil (**admin**, **profissional**, **responsável**) para colar no seu *pool* de conexões.

[1]: https://www.postgresql.org/docs/current/functions-admin.html?utm_source=chatgpt.com "Documentation: 18: 9.28. System Administration Functions"
[2]: https://www.postgresql.org/docs/current/citext.html?utm_source=chatgpt.com "18: F.9. citext — a case-insensitive character string type"
[3]: https://www.postgresql.org/docs/current/pgcrypto.html?utm_source=chatgpt.com "Documentation: 18: F.26. pgcrypto — cryptographic functions"
[4]: https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com "F.35. pg_trgm — support for similarity of text using trigram ..."
[5]: https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com "Documentation: 18: 5.9. Row Security Policies"
[6]: https://www.postgresql.org/docs/current/sql-createpolicy.html?utm_source=chatgpt.com "Documentation: 18: CREATE POLICY"
[7]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[8]: https://www.postgresql.org/docs/current/uuid-ossp.html?utm_source=chatgpt.com "Documentation: 18: F.49. uuid-ossp — a UUID generator"
