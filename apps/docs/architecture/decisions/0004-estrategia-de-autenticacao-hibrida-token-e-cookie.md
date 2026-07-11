# 0004 - Estratégia de Autenticação Híbrida via Headers e Cookies Seguros

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Segurança da Informação

---

## 1. Contexto e Problema
O SlowPace precisa de um mecanismo de autenticação que proteja os endpoints privados das APIs de Hobbies, Finanças e Tarefas. Usuários neurodivergente exigem uma experiência sem fricção manual de re-login constante (paralisia executiva diante de barreiras de autenticação quebradas). 

Sob a ótica de segurança, armazenar tokens JWT puros no `localStorage` do navegador expõe a sessão a roubos via scripts maliciosos (XSS). Por outro lado, engessar a API para ler apenas cookies inviabilizaria testes automatizados puros ou futuros clientes nativos mobile.

## 2. Opções Consideradas
- **Abordagem A (Apenas Header Authorization / Bearer):** Obriga o PWA a guardar o token no `localStorage`/`sessionStorage` e injetá-lo em cada requisição. Vulnerável a ataques de XSS.
- **Abordagem B (Apenas Cookies HttpOnly):** Tranca a autenticação ao escopo do navegador. Seguro para a Web, mas dificulta testes automatizados e integrações com clients HTTP.
- **Abordagem C (Estratégia Híbrida de Fallback - Escolhida):** O middleware intercepta prioritariamente o cabeçalho `Authorization` e, caso ausente, busca o token no cookie criptografado do navegador.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. O arquivo `src/middleware/auth-middleware.ts` valida as requisições extraindo o JSON Web Token (JWT) de forma flexível. O payload decodificado anexa o identificador único do usuário diretamente no escopo da requisição do Fastify (`request.user = { sub: decoded.sub }`).

Essa escolha combina o nível máximo de segurança web (usando cookies HttpOnly protegidos pelo ecossistema do navegador) com a flexibilidade de desenvolvimento de APIs baseadas em tokens padrão de mercado.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Segurança Avançada no PWA:** O cliente web pode trafegar sessões via cookies omitindo o armazenamento local de chaves.
- **Flexibilidade de Integração:** Ferramentas de testes automatizados e scripts locais podem disparar requisições para a API simplesmente injetando o cabeçalho `Authorization: Bearer <token>`.
- **Falha Previsível e Segura:** Qualquer exceção no ciclo de verificação (assinatura violada, expiração ou ausência de chave de ambiente) interrompe o fluxo imediatamente com HTTP 401.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Acoplamento de Tipagem:** O Fastify precisa conhecer a propriedade `.user` injetada dinamicamente dentro de `request`.
  *Mitigação:* Resolvido através da criação do arquivo de definição global de tipos em `src/types/fastify.d.ts` estendendo a interface do core do framework.

---

## 5. Referências e Links
- Implementação realizada no arquivo `src/middleware/auth-middleware.ts`.
- Conectado às definições de cookie secret parametrizadas na **ADR 0002**.