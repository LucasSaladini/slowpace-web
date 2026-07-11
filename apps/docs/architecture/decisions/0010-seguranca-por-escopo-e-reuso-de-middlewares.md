# 0010 - Autenticação Compulsória por Escopo de Roteamento e Reuso de Middlewares

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Gestão de Débito Técnico

---

## 1. Contexto e Problema
Os sub-módulos do SlowPace (Finanças, Tarefas e Hobbies) operam sob dados estritamente privados que exigem autenticação do usuário. Configurar a proteção de rotas de maneira individual endpoint por endpoint induz ao erro humano (esquecimento de blindagem de novas rotas). 

Por outro lado, duplicar a lógica de verificação de tokens criando funções locais de validação dentro de cada arquivo de rotas fragmenta a manutenibilidade do sistema e viola as diretrizes de centralização da **ADR 0004**.

## 2. Opções Consideradas
- **Abordagem A (Injeção Granular por Rota):** Passar o middleware de autenticação manualmente no objeto de configuração de cada verbo HTTP (ex: `app.get('/path', { preHandler: authMiddleware }, handler)`). Propenso a falhas de esquecimento.
- **Abordagem B (Middleware Global no Core do Servidor):** Aplicar o middleware em `app.ts` afetando tudo. Inviável, pois bloquearia rotas de autenticação pública como `/login` e `/signup`.
- **Abordagem C (Injeção via Hooks de Ciclo de Vida por Escopo de Plugin - Escolhida):** Isolar os domínios privados em arquivos de rotas específicos carregados com prefixos e utilizar o método `app.addHook('preHandler', authMiddleware)` injetando o middleware reaproveitado globalmente.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. Todos os endpoints contidos em roteadores de domínios privados serão blindados de forma automatizada através do hook de ciclo de vida local do Fastify. 

Fica terminantemente proibida a duplicação ou reescrita local de lógicas de assinatura e decodificação de chaves JWT dentro de arquivos de rotas. O arquivo único de referência obrigatória para proteção de rotas privadas passa a ser o `src/middleware/auth-middleware.ts`.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Blindagem por Padrão (Fail-Safe):** Qualquer nova rota financeira, de foco ou hobby adicionada ao arquivo correspondente nascerá automaticamente protegida pelo hook de escopo.
- **Ponto Único de Manutenção:** Alterações em tokens, chaves ou políticas de expiração afetam de forma instantânea e homogênea todo o ecossistema do backend.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Atenção a Rotas Públicas Ocasionais:** Se no futuro houver necessidade de expor uma rota pública dentro de um sub-módulo privado (ex: um webhook público de finanças), ela precisará ser extraída para um arquivo de rotas separado que não herde o hook do escopo original.

---

## 5. Referências e Links
- Acoplamento de Hooks validado em `src/routes/finance-routes.ts`.
- Lógica reaproveitada com base na centralização de tokens descrita na **ADR 0004**.