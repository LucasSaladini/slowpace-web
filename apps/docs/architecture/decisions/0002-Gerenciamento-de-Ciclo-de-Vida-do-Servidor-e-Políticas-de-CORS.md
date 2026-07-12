# 0002 - Gerenciamento de Ciclo de Vida do Servidor e Políticas de CORS/Cookies

- **Status**: Accepted
- **Data**: 2026-07-12
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Segurança da Informação

---

## 1. Contexto e Problema
O backend do SlowPace funciona como uma API exposta para um cliente PWA. Como tratamos de dados sensíveis de usuários (dados financeiros e registros de saúde mental/rotina), a comunicação precisa ser blindada contra ataques de Cross-Site Scripting (XSS) e Cross-Site Request Forgery (CSRF). 

Além disso, a forma atual de inicialização gerava duplicidade de código entre `server.ts` e `app.ts`, quebrando o escopo do ecossistema de testes automatizados (`.spec.ts`), que não herdava as rotas de Finanças, Hobbies e Tarefas de Foco.

## 2. Opções Consideradas
- **Abordagem A (CORS Aberto `*`):** Permitir qualquer origem. Inviável para produção por expor dados de usuários e proibir o uso de cookies com `credentials: true`.
- **Abordagem B (Configuração estática em arquivo de build):** Engessar as URLs permitidas, impedindo testes locais simultâneos com ambientes de staging/produção.
- **Abordagem C (Unificação via Factory Pattern + CORS Dinâmico - Escolhida):** Concentrar toda a inicialização e injeção de plugins do Fastify dentro de uma única Factory Function (`buildApp`) e utilizar tratamento de strings em runtime para higienizar e validar as origens permitidas via variáveis de ambiente.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. O arquivo `app.ts` atuará como a única fonte da verdade para a montagem do servidor, encapsulando cookies, CORS restrito e rotas. O `server.ts` será puramente o ponto de entrada de execução (Bootstrap) chamando o `buildApp()`.

Para a segurança dos dados, o CORS foi configurado de forma dinâmica:
- As strings de origem passam por uma higienização via Regex (`replace(/\/$/, "")`) para evitar descompasso por uma barra `/` acidental no fim da URL do `.env`.
- Uso de `credentials: true` pareado com `@fastify/cookie` usando segredo criptográfico, permitindo transporte seguro de tokens de sessão sem expô-los no `localStorage`.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Paridade de Testes:** O ambiente de testes com Vitest usará exatamente o mesmo setup de plugins e rotas que roda em produção.
- **Blindagem do PWA:** Impede que domínios maliciosos façam requisições para os endpoints de domínios sensíveis do SlowPace.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Fricção em Ambientes de Preview:** Se uma branch de Pull Request do Front-end gerar uma URL dinâmica (ex: Vercel Preview), as requisições serão bloqueadas pelo CORS.
  *Mitigação:* O array de origens permitidas aceita o `frontendUrl` dinâmico do `.env`, bastando atualizar a variável no pipeline se necessário.

---

## 5. Referências e Links
- Implementação unificada realizada com sucesso em `src/app.ts` e `src/server.ts` através da US34.