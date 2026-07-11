# 0007 - Limitação de Trabalho em Progresso (WIP) e Validação de Contratos de Entrada

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US18, US28, Arquitetura de Calma

---

## 1. Contexto e Problema
ToDo lists tradicionais permitem acúmulo infinito de pendências, gerando ansiedade, frustração e abandono por parte de usuários neurodivergentes (paralisia por perfeccionismo). O SlowPace precisa atuar como um filtro protetor. 

Para isso, a interface e o backend devem limitar estritamente o número de tarefas de foco diário simultâneas na visão ativa. Além disso, para blindar o banco de dados contra payloads corrompidos que quebrem a UX, as entradas precisam ser validadas rigidamente em runtime.

## 2. Opções Consideradas
- **Abordagem A (Listas Infinitas com Paginação):** Comportamento padrão de mercado. Rejeitado por violar o princípio de "Software de Calma".
- **Abordagem B (Validação e Limitação Apenas no Front-end):** Confiar que o PWA bloqueará o botão de adicionar. Inseguro, pois requisições diretas via API burlariam a barreira biológica de proteção do usuário.
- **Abordagem C (Limitação de WIP no Core do Backend + Validação Zod - Escolhida):** O backend assume a responsabilidade de contar os focos pendentes antes de qualquer mutação. Se o limite de **5 tarefas ativas** for atingido, o sistema desvia o fluxo para o backlog de forma passiva no cadastro ou rejeita a ativação na atualização. Os contratos de entrada são parseados pelo Zod.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. O número máximo de tarefas ativas (`isCompleted: false` e `isBacklog: false`) é fixado em **5**. O backend rejeitará de forma imperativa (HTTP 400) qualquer tentativa de mover uma tarefa do backlog para o dia se o limite estiver estourado.

Fica determinado que os tipos implícitos (`as Any` ou `as Interface`) serão gradativamente substituídos por esquemas do Zod executados logo no início dos métodos das controllers, garantindo falha antecipada (*fail-fast*) caso o payload esteja malformado.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Garantia de UX Acolhedora:** O ecossistema força o usuário de forma gentil a focar em lotes pequenos de objetivos por vez, reduzindo a fricção executiva.
- **Segurança de Tipagem Real:** Esquemas Zod limpam o payload de propriedades injetadas e garantem strings higienizadas (`trim()`).

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Custo Extra de Infraestrutura (Query de Contagem):** Toda criação de tarefa exige um `COUNT` prévio no banco.
  *Mitigação:* Como validamos na **US22**, a tabela `focus_tasks` possui o índice composto `focus_tasks_userId_isCompleted_isBacklog_idx`. Essa query de contagem roda em microsegundos, tornando o custo insignificante.

---

## 5. Referências e Links
- Lógica de limitação implementada em `src/controllers/focus-task-controller.ts`.
- Mapeamento de índices protetores documentado nos testes da **US22**.