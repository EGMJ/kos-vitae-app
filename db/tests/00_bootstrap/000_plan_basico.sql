CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(1);
SELECT ok(true, 'Ambiente de testes pgTAP operacional');
SELECT finish();