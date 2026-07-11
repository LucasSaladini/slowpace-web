# 0005 - Padronização de Emissão de Tokens e Isolamento de Estado de Sessão

- **Status**: Proposed
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Segurança da Informação

---

## 1. Contexto e Problema
O `authController` gerenciava a criação de contas e o login. Contudo, o método de registro (`signUp`) injetava o token JWT gerado diretamente no corpo da resposta HTTP, enquanto o método de login (`signIn`) utilizava cookies protegidos (`HttpOnly`). Essa divergência forçava o cliente PWA a gerenciar o estado da sessão de duas formas diferentes, expondo o token do cadastro a ataques de XSS.

Além disso, a presença de fallbacks de criptografia em texto limpo (`'slowpace-secret'`) criava vulnerabilidades potenciais caso o ambiente rodasse sem as variáveis devidamente validadas.

## 2. Opções Consideradas
- **Abordagem A (Manter hibridismo por rota):** Manter o cadastro via JSON e o login via Cookie. Complexifica a lógica do front-end e mantém brechas de segurança.
- **Abordagem B (Retornar JWT puramente via JSON em tudo):** Delegar 100% da segurança para o PWA armazenar os tokens. Violaria a **ADR 0004**.
- **Abordagem C (Centralização Estrita de Cookies e Falha Crítica de Variáveis - Escolhida):** Modificar todos os fluxos de geração de sessão para injetar exclusivamente o cookie HTTP-Only, removendo fallbacks de segurança em texto limpo e forçando o crash da aplicação caso o `JWT_SECRET` esteja ausente.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. Fica decretado que a API do SlowPace nunca retornará tokens JWT em payloads de texto (JSON) para rotas de autenticação core. O token de autenticação deve ser exclusivamente transportado via cabeçalho HTTP `Set-Cookie` com as propriedades:
- `httpOnly: true` (Bloqueia acesso via `document.cookie`).
- `secure: true` em ambiente de produção (Exige HTTPS).
- `sameSite: 'lax'` (Previne ataques Cross-Site comuns).

Qualquer tentativa de assinar um token sem a presença real de `process.env.JWT_SECRET` disparará um erro fatal no ciclo de execução, impedindo falhas silenciosas de criptografia.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Unificação de Consumo no Front-end:** O PWA não precisa capturar ou ler chaves de tokens ao cadastrar ou logar; o navegador gerencia o anexo do cookie automaticamente de forma opaca.
- **Segurança Homogênea:** Elimina o ponto cego de vazamento de sessão na rota de criação de contas.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Ajuste no Front-end:** O PWA precisará ser adaptado para ler apenas o objeto `{ user }` vindo da rota de `signUp`, exatamente como já faz no `signIn`.

---

## 5. Referências e Links
- Comportamento de Cookies alinhado com as diretrizes da **ADR 0002** e da **ADR 0004**.