# 0001 - Padrão Arquitetural do Backend e Divisão de Camadas

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: Gestão de Débito Técnico

---

## 1. Contexto e Problema
O backend do SlowPace precisa lidar de forma previsível e isolada com fluxos distintos de domínios (Autenticação, Hobbies, Finanças e Tarefas de Foco). Sendo uma aplicação voltada para usuários neurodivergentes, alterações na API não podem gerar efeitos colaterais de quebra ou inconsistência de UX. Precisávamos de um padrão que organizasse a entrada de requisições, validações, processamento de lógica e persistência sem acoplamento direto.

## 2. Opções Consideradas
- **Abordagem A (Arquitetura MVC Tradicional / Monolítica):** Acoplar controllers diretamente a engines de renderização ou rotas centralizadas em um único arquivo.
- **Abordagem B (Clean Architecture / DDD Completo):** Separar o projeto estritamente em `Domain`, `Application`, `Infrastructure` e `WebAPI`. Embora forneça isolamento máximo, adicionaria boilerplate excessivo para o momento inicial do SaaS.
- **Abordagem C (Arquitetura em Camadas por Responsabilidade - Escolhida):** Divisão desacoplada e enxuta utilizando o ecossistema nativo do Fastify (`routes`, `controllers`, `middlewares`, `schemas` de validação e camada de dados separada).

## 3. Decisão Escolhida
Adotamos a **Abordagem C**, estruturando o diretório `src/` em camadas especializadas:
- `server.ts` & `app.ts`: Inicialização da engine e registro de plugins globais.
- `routes/`: Declaração dos endpoints e acoplamento de middlewares locais.
- `controllers/`: Orquestração do fluxo de requisição, tratamento de regras de negócio de aplicação e respostas HTTP.
- `schemas/`: Contratos de validação em tempo de execução (Zod).
- `db/` & `prisma/`: Camada de persistência isolada dos controladores.

Essa estrutura garante alta coesão e baixo acoplamento, facilitando testes automatizados com Vitest e escalabilidade limpa das novas features protetoras de hiperfoco.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Facilidade de Onboarding:** Estrutura intuitiva e amplamente adotada na comunidade Node.js/TypeScript.
- **Testabilidade:** Controladores e utilitários podem ser testados isoladamente das rotas HTTP.
- **Performance:** O uso nativo de plugins do Fastify para carregar as rotas não impacta a árvore de inicialização.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Risco de Inchaço nos Controllers:** À medida que lógicas complexas de IA forem adicionadas (como extração passiva de áudio), os controllers podem acumular responsabilidade. 
  *Mitigação:* Se uma regra de negócio passar de 30-40 linhas, ela deverá ser extraída para uma nova camada de `services/` ou `use-cases/`.

---

## 5. Referências e Links
- Estrutura mapeada no diretório raiz do projeto em `src/`.