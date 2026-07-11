# 0003 - Estratégia de Pooling de Conexões usando Adaptador Nativo do PostgreSQL

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US22, US28, Otimização de Infraestrutura

---

## 1. Contexto e Problema
Por padrão, o Prisma ORM gerencia as conexões com o banco de dados através de uma engine interna escrita em Rust. Embora eficiente, esse comportamento padrão dificulta o ajuste fino de propriedades do pool de conexões (como tempo máximo de ociosidade, conexões máximas simultâneas e reutilização de sockets de rede), o que pode levar ao estouro de conexões em ambientes com picos de tráfego concorrente ou deploys escaláveis no Fastify.

## 2. Opções Consideradas
- **Abordagem A (Prisma Client Padrão):** Instanciar o `new PrismaClient()` puro confiando apenas na query engine interna do ORM.
- **Abordagem B (Substituição por Query Builder Puro - Kysely/Knex):** Remover o Prisma e adotar um construtor de queries com driver nativo. Aumentaria drasticamente a fricção de desenvolvimento (DX) e quebraria os schemas já consolidados.
- **Abordagem C (Prisma Client com Driver Adapter Nativo - Escolhida):** Combinar o ecossistema do Prisma com o driver `pg` (`node-postgres`) através do `@prisma/adapter-pg`.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. A instância global do `PrismaClient` exportada por `src/db/database.ts` é acoplada a um `pg.Pool` explícito gerenciado pelo Node.js. 

Isso nos permite delegar o ciclo de vida das conexões de rede ao driver mais robusto e performático de mercado do ecossistema PostgreSQL para Node, permitindo futuras otimizações de infraestrutura (como limites de conexão e tratamento de failover) diretamente nos parâmetros do construtor da classe `Pool`.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Controle Fino de Conexões:** Facilidade para configurar parâmetros de resiliência de rede (ex: `max: 20`, `idleTimeoutMillis`) se o app escalar para ambientes de container (Docker/Kubernetes).
- **Estabilidade do Pool:** Mitiga o erro comum de *connection exhaustion* do PostgreSQL em ambiente de desenvolvimento local e produção.
- **Transparência de DX:** O restante da aplicação consome a constante `prisma` normalmente, sem perceber que há um adaptador por baixo.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Acoplamento de Inicialização:** Scripts executados fora do escopo da aplicação (como scripts isolados ou o `seed.ts`) precisam garantir que o ambiente consiga ler o `process.env.DATABASE_URL` para alimentar o Pool, caso contrário o cliente falhará em tempo de inicialização.
  *Mitigação:* Documentado o padrão e corrigido o `seed.ts` para carregar o `dotenv` explicitamente na raiz da sua execução.

---

## 5. Referências e Links
- Implementação realizada no arquivo `src/db/database.ts`.
- Documentação oficial do Prisma sobre Driver Adapters.