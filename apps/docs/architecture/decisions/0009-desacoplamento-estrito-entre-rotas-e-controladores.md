# 0009 - Desacoplamento Estrito entre Definição de Rotas (Transporte) e Controladores (Aplicação)

- **Status**: Proposed
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Gestão de Débito Técnico

---

## 1. Contexto e Problema
Identificou-se que o arquivo `auth-routes.ts` acumulava dupla responsabilidade: além de definir os caminhos dos endpoints HTTP e aplicar middlewares, ele implementava diretamente as regras de negócio de aplicação (validação com Zod, hashing de senhas, consultas diretas ao Prisma e geração de tokens). 

Isso gerava duplicidade oculta com o `auth-controller.ts` (que continha uma implementação similar e sem uso real), dificultava testes de unidade puros e quebrava as políticas unificadas de segurança de cookies estabelecidas nas **ADR 0004** e **ADR 0005**.

## 2. Opções Consideradas
- **Abordagem A (Inlining de Código / Inline Handlers):** Manter a lógica de negócio direto nos arquivos de rotas. Torna o desenvolvimento inicial rápido, mas colapsa a manutenção à medida que o sistema ganha regras complexas (ex: processamento de IA).
- **Abordagem B (Separação Rígida em Camadas - Router-Controller Pattern - Escolhida):** Arquivos de rotas tornam-se puramente declarativos (configuração de caminhos, verbos, esquemas e segurança). Toda a lógica imperativa de execução é delegada aos métodos dos objetos controladores (`controllers/`).

## 3. Decisão Escolhida
Adotamos a **Abordagem B**. Fica estabelecido que nenhum arquivo contido na pasta `src/routes/` poderá conter blocos de tratamento imperativo `try/catch` ou invocações diretas ao cliente do Prisma. 

As rotas do Fastify devem atuar exclusivamente como uma camada de mapeamento e transporte, injetando middlewares de ciclo de vida (como `preHandler: [authMiddleware]`) e passando o controle da requisição e resposta diretamente para os controladores correspondentes.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Zero Duplicidade de Código:** Unifica a lógica de autenticação em um único ponto focal (`auth-controller.ts`), facilitando auditorias de segurança e correções de bugs.
- **Conformidade de Segurança:** Garante que as políticas de injeção de cookies HTTP-Only rodem de forma centralizada conforme as diretrizes passadas.
- **Leitura Limpa:** Arquivos de rotas tornam-se mapas autoexplicativos de navegação da API.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Fricção de Refatoração Imediata:** Exige varrer os arquivos de rotas atuais para mover seus blocos de execução para dentro dos controladores que estavam sem uso, adaptando os retornos.

---

## 5. Referências e Links
- Alinhado com a divisão de responsabilidades proposta na **ADR 0001**.