# 0014 - Integridade Referencial Baseada em Banco de Dados e Padronização de Cascade Delete

- **Status**: Proposed
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US22, US28, Modelagem de Banco de Dados

---

## 1. Contexto e Problema
A exclusão de entidades pai (como `User` ou `Hobby`) exige a limpeza imediata de suas entidades filhas dependentes (`Hobby`, `Session`, `Transaction`, `FocusTask`) para evitar dados órfãos que poluem o banco e corrompem relatórios agregados. Atualmente, o sistema apresenta um comportamento misto: alguns relacionamentos dependem de triggers nativos em cascata (`onDelete: Cascade`), enquanto outros exigem queries imperativas manuais executadas sequencialmente na camada de aplicação (controladores).

Essa abordagem mista aumenta o risco de falhas de consistência caso uma query falhe no meio do ciclo e infla os controladores com lógica de infraestrutura que pertence ao banco.

## 2. Opções Consideradas
- **Abordagem A (Gerenciamento Manual via Código / Application-level Cascade):** Manter transações manuais ou queries sequenciais no Prisma para limpar registros dependentes. Rejeitado por abrir margem para dados órfãos em caso de falha de runtime e aumentar o overhead de rede da API.
- **Abordagem B (Delegação Nativa via Restrições de Banco - Escolhida):** Configurar explicitamente a propriedade `onDelete: Cascade` em todas as relações do arquivo `schema.prisma`. O mapeamento gera chaves estrangeiras com regras `ON DELETE CASCADE` diretamente no engine do PostgreSQL.

## 3. Decisão Escolhida
Adotamos a **Abordagem B**. Fica decretado que nenhuma controller ou action do SlowPace será responsável por disparar deleções manuais de tabelas filhas para garantir o sucesso de uma exclusão de registro pai. 

Todos os relacionamentos de dependência hierárquica estrita (User -> Hobbies, Hobby -> Sessions) devem repassar a ordem de destruição de forma nativa e atômica em nível de banco de dados através da diretiva do Prisma.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Integridade de Dados Garantida:** Elimina 100% o risco de vazamento de linhas órfãs (ex: sessões que apontam para um hobby inexistente).
- **Simplificação do Código:** Permite limpar e enxugar o método `delete` do `hobbyController`, removendo o `deleteMany` de sessões e reduzindo o tráfego de rede entre a aplicação e o banco.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Necessidade de Migration Destrutiva:** Alterar restrições de chaves estrangeiras existentes exige gerar uma nova migration no Prisma, aplicando um `DROP CONSTRAINT` seguido de um `ADD CONSTRAINT` com a nova regra.
  *Mitigação:* Executar a migration em horário de manutenção ou ambiente controlado, garantindo o backup prévio do estado físico.

---

## 5. Referências e Links
- Esquema mapeado e atualizado em `prisma/schema.prisma`.
- Alinhado com a otimização de consultas e performance descrita na **ADR 0008**.