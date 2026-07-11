# 0012 - Extensão de Tipagem Global (Module Augmentation) para Segurança Estática

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US28, Gestão de Débito Técnico

---

## 1. Contexto e Problema
Middlewares de autenticação frequentemente interceptam requisições HTTP, validam credenciais e anexam o contexto do usuário autenticado (como o ID da sessão) ao objeto de requisição para uso posterior nos controladores. Frameworks Node.js fortemente tipados, como o Fastify em conjunto com o TypeScript, não possuem essas propriedades customizadas em suas interfaces nativas. 

Utilizar asserções de tipo soltas (ex: `(request as any).user`) nas camadas de aplicação elimina os benefícios de checagem do compilador, introduz riscos de erros em runtime e degrada a Experiência de Desenvolvimento (DX).

## 2. Opções Consideradas
- **Abordagem A (Casts Locais / `as any`):** Forçar a tipagem manualmente em cada controlador onde o usuário é requisitado. Altamente inseguro e propenso a erros de digitação.
- **Abordagem B (Wrapper de Requisição Customizado):** Criar uma classe ou interface própria que herda do Fastify e estende as propriedades. Adicionaria overhead de herança e acoplamento desnecessário ao ecossistema do framework.
- **Abordagem C (Module Augmentation Global - Escolhida):** Utilizar a palavra-chave `declare module` do TypeScript para fundir a interface nativa do `FastifyRequest` com as propriedades de contexto de segurança do SlowPace.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. O arquivo `src/types/fastify.d.ts` estende globalmente o core do Fastify. Fica determinado que o identificador único do usuário autenticado extraído dos tokens JWT será obrigatoriamente injetado e lido sob a propriedade estruturada `request.user.sub`.

Nenhum código no backend está autorizado a usar supressões de tipo (`@ts-ignore`) ou coerções para `any` para acessar metadados de sessão do usuário no ciclo de vida HTTP.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Segurança de Compilação (Typesafe):** Qualquer alteração futura na estrutura do token que mude a propriedade `sub` quebrará o build do projeto imediatamente, apontando cirurgicamente quais controladores precisam de correção.
- **Excelente DX:** IntelliSense nativo do VS Code/Cursor guiando o desenvolvimento ao digitar `request.user.`.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Acoplamento com Inicialização do TS Config:** Arquivos de definição de tipo (`.d.ts`) exigem que o arquivo `tsconfig.json` esteja configurado corretamente para incluir a pasta `types/` no processo de compilação global (`include`).
  *Mitigação:* Configuração verificada e travada no arquivo de build raiz do projeto.

---

## 5. Referências e Links
- Implementação declarada em `src/types/fastify.d.ts`.
- Conectado diretamente ao comportamento de injeção de dados implementado no middleware central na **ADR 0004**.