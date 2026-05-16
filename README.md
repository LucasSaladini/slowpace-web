# SlowPace 🌿

## 📌 Project Charter

### Título e Problema

**SlowPace**. A maioria dos rastreadores de hábitos e ferramentas de produtividade utiliza gatilhos de pressão, como os streaks (sequência de dias), e interfaces saturadas de notificações que geram ansiedade e a sensação de "falha" em caso de inatividade
. O SlowPace resolve isso oferecendo uma interface acolhedora e "anti-streak", transformando a gestão de hobbies em um momento de descompressão, sem punições ou cobranças

### Público-Alvo e Objetivo

O foco são entusiastas de hobbies e pessoas neurodivergentes (como portadores de TDAH) que buscam autorregulação e um refúgio da "produtividade tóxica"
. O objetivo é criar um web app low-stimulus focado no prazer do processo, permitindo o registro de evolução pessoal de forma estável e segura.

### Equipe e Papéis

- **Product Owner / Scrum Master / Desenvolvedor**: Lucas Saladini Toledo Veiga
- \_Responsável pela visão do produto, gestão do backlog via GitHub Projects e implementação técnica completa (Full Stack).

### Recursos e Ferramentas (Tech Stack)

- **Frontend**: Next.js (React) com Tailwind CSS.
- **Backend**: Node.js com Fastify e Prisma ORM.
- **Banco de Dados**: PostgreSQL.
- **Segurança**: Autenticação via JWT e Hashing de senhas com BCrypt.
- **Infraestrutura**: Deploy automatizado via Vercel.

### Métricas de Sucesso

- **Técnica**: Aplicação publicada na Vercel com integração funcional e segura ao banco de dados
- **Funcional**: Ciclo completo de cadastro, login e registro de atividades operacionais.
- **Impacto**: Implementação da "Stardust View", um sistema de valorização do esforço acumulado que elimina a paralisia por perfeccionismo.

---

## 👤 Personas

1. **Alex Oliveira (Neurodivergente)**: Possui alta sensibilidade sensorial e lida mal com a sensação de "falha" causada por aplicativos de streak tradicionais. Busca o hobby para autorregulação.
2. **Beatriz Santos (Neurotípica)**: Profissional organizada que sofre com o burnout da gamificação da vida. Deseja um "diário" para sentir que teve vida além do trabalho, sem métricas de performance.

---

## 🚀 User Stories Finalizadas (v1.1.0)

Todas as 8 User Stories planejadas foram integralmente implementadas:

- **US01 - Autenticação**: Cadastro e login seguros com JWT e BCrypt para garantir a privacidade dos dados.
- **US02 - Gestão de Hobbies**: Cadastro de até 5 atividades com sugestão de tons pastéis para evitar sobrecarga cognitiva.
- **US03 - Registro de Prática**: Log de tempo dedicado com suporte a lançamentos retroativos e mensagens acolhedoras.
- **US04 - Dashboard Stardust**: Visualização de impacto baseada na soma total de horas dedicadas, sem contadores de sequência.
- **US05 - Botão de Pausa**: Ativa um estado de repouso visual (sépia/grayscale) e oculta lembretes para evitar culpa.
- **US06 - Timeline de Memórias**: Histórico cronológico contínuo que pula dias sem registros, eliminando a visão de "lacunas" no progresso.
- **US07 - Acessibilidade de Tema**: Opções de temas Claro, Suave (Soft Dark) e Sépia para reduzir a fadiga sensorial.
- **US08 - Onboarding Tour**: Guia inicial explicativo para novos usuários, com persistência de estado no banco de dados.

---

## 🎨 Identidade Visual: "Quiet Morning"

A paleta de cores foi desenhada para promover calma e reduzir o cansaço visual:

- **Background**: Off-Black (#1E2022) e Warm Paper (#F5F2ED).
- **Acentos**: Sage Green (#A8B7AB) e Muted Sand (#D4A373).
- **Validação**: Soft Periwinkle (#B8C0FF).

---

## 🛠️ Status Técnico e Links

- **Ambiente de Produção**: [slowpace-web.vercel.app](https://slowpace-web.vercel.app)
- **Quadro Kanban**: [GitHub Projects - Sprint 0 & 1](https://github.com/users/LucasSaladini/projects/3/views/1)
- **Última Release**: [v1.1.0 - Arquitetura do Calma.](https://github.com/LucasSaladini/slowpace-web/releases/tag/v1.1.0)
- **Registro de Atividade**: O projeto conta com 41 commits realizados de forma incremental utilizando múltiplas branches para organização.Branch [main](https://github.com/LucasSaladini/slowpace-web/commits/main/)
