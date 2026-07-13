# 0011 - Normalização de Dados e Isolamento de Schemas de Validação em Runtime

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Segurança da Informação

---

## 1. Contexto e Problema
O backend do SlowPace interage diretamente com o cliente PWA. Inputs do usuário enviados via formulários HTTP podem conter inconsistências de formatação (letras maiúsculas misturadas, espaços adicionais no início/fim gerados por corretores automáticos). Confiar nesses dados brutos para chaves de busca exclusivas no banco (como o e-mail) resulta em falhas de autenticação silenciosas ou duplicidade lógica de registros. 

Além disso, utilizar o mesmo esquema de dados (`signUpSchema`) para fluxos semanticamente distintos (Registro e Login) acopla as restrições de validação de forma perigosa.

## 2. Opções Consideradas
- **Abordagem A (Sanitização nos Controladores/Rotas):** Aplicar métodos manuais de manipulação de string (ex: `.trim()`) nas funções imperativas das rotas ou controllers. Descentraliza a regra e induz ao erro humano por esquecimento.
- **Abordagem B (Normalização Declarativa via Zod Schemas - Escolhida):** Utilizar encadeamentos nativos do Zod (como `.trim()` e `.toLowerCase()`) diretamente na camada de definição dos esquemas, forçando a higienização dos dados na borda imediata de entrada da aplicação.

## 3. Decisão Escolhida
Adotamos a **Abordagem B**. Todos os esquemas declarados em `src/schemas/` devem atuar não apenas como validadores de tipo, mas como transformadores e higienizadores de dados (*Data Sanitizers*). 

Os esquemas de input para Registro (`signUpSchema`) e Login (`signInSchema`) serão explicitamente individualizados, impedindo que futuras políticas de complexidade de senha (ex: exigência de caracteres especiais no cadastro) quebrem a retrocompatibilidade do fluxo de login de usuários antigos.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Consistência do Banco de Dados:** Garante que todos os e-mails persistidos no PostgreSQL sigam um padrão rigoroso e unificado em caixa baixa, eliminando colisões de busca.
- **Fail-Fast de Borda:** Requisições malformadas ou com payloads poluídos são rejeitadas imediatamente no transporte, economizando processamento e queries de banco.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Pequeno Boilerplate Adicional:** Multiplica a declaração de objetos Zod no projeto para acomodar variações sutis de regras.
  *Mitigação:* Utilização de herança de objetos do Zod via método `.extend()` ou `.pick()` para reaproveitar propriedades comuns como o campo de e-mail.

---

## 5. Referências e Links
- Implementação base mapeada em `src/schemas/auth-schema.ts`.
- Conectado às diretrizes de validação fail-fast descritas na **ADR 0007**.