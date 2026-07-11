# 0008 - Otimização de Agregações de Dados Históricos e Centralização de Estado de Pausa

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US05, US22, US28

---

## 1. Contexto e Problema
O painel de Hobbies (Stardust Dashboard) calcula o total de horas e minutos dedicados ao descanso do usuário. A computação inicial realizava o mapeamento de coleções trazendo todos os registros de sessões em memória via Javascript (`reduce`). À medida que os usuários acumulam dados históricos, essa abordagem causa degradação linear de performance na listagem principal.

Além disso, o SlowPace possui o recurso exclusivo "Botão de Pausa Total" (Modo Pausa), cujas regras de comportamento (ocultar histórico, silenciar frases de incentivo) precisam estar blindadas no backend.

## 2. Opções Consideradas
- **Abordagem A (Manter Agregação em Memória - Runtime JavaScript):** Trazer todas as entidades pelo Prisma e computar o array. Causa sobrecarga na CPU do servidor.
- **Abordagem B (Delegação de Agregações ao Banco - Escolhida):** Utilizar os recursos nativos de agrupamento (`_sum`, `groupBy`) do Prisma/PostgreSQL para retornar apenas o resultado escalar do cálculo para a API, mantendo o consumo de memória do servidor constante ($O(1)$).

## 3. Decisão Escolhida
Adotamos a **Abordagem B**. Cálculos matemáticos cumulativos de duração de sessões de hobbies não carregarão mais sub-coleções inteiras. O banco de dados resolverá a soma nativamente através dos índices validados na **US22**.

Fica sacramentado o comportamento do Modo Pausa: quando ativo (`isPaused: true`), o endpoint de histórico deve omitir registros passados (`return []`), bloqueando de forma intencional o loop de cobrança executiva por desempenho e quebrando a ansiedade por consistência perfeita.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Performance Escalável:** O consumo de memória do Fastify permanece estável independentemente se o usuário possui 10 ou 10.000 sessões salvas.
- **Isolamento de Domínio:** Limpeza de concorrência com a eliminação da rota duplicada `completeTour` (que passa a ser de responsabilidade única do `authController`).

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Queries Separadas:** Para obter o totalizador geral e os totalizadores por hobby de forma otimizada no banco, o controlador pode precisar disparar duas promessas paralelas (`Promise.all`), o que exige atenção na gerência de conexões do pool.

---

## 5. Referências e Links
- Comportamento de agregação e Modo Pausa mapeados em `src/controllers/hobby-controller.ts`.
- Gerenciamento de pool de conexões otimizado na **ADR 0003**.