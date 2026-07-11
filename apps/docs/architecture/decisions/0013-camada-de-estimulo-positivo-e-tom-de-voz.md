# 0013 - Camada de Estímulo Positivo Baseado em Psicologia de Aterramento e Autocompaixão

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US05, US28, Arquitetura de Calma

---

## 1. Contexto e Problema
Sistemas tradicionais de rastreamento utilizam táticas de gamificação punitiva (como contadores de *streaks*/ofensivas que quebram, notificações intrusivas e mensagens de urgência), gerando ansiedade e o paradoxo do abandono por falha em usuários neurodivergentes. O SlowPace precisa de um mecanismo que substitua a dopamina artificial de cobrança por validações intrínsecas de progresso e acolhimento.

## 2. Opções Consideradas
- **Abordagem A (Gamificação Tradicional de Cobrança):** Implementar contadores e troféus baseados em frequência ininterrupta. Rejeitado por violar a premissa de "Software de Calma".
- **Abordagem B (Retornos de Mensagens Genéricas / CRUD Puro):** Responder às mutações de sessão apenas com mensagens de sucesso do sistema (ex: `"Sessão criada com sucesso"`). Frio e mecânico, perderia a oportunidade de conexão emocional com o usuário.
- **Abordagem C (Mecanismo Textual de Suporte e Aterramento - Escolhida):** Injetar no ciclo de respostas de eventos da API feedbacks contextuais de suporte psicológico divididos entre Frases de Aterramento (*Grounding*) e Frases Reflexivas (*Reflective*), governados pelo estado de energia do perfil do usuário.

## 3. Decisão Escolhida
Adotamos a **Abordagem C**. O arquivo `src/utils/encouragement.ts` centraliza as matrizes textuais autorizadas a interagir com o estado emocional do usuário no encerramento de atividades de hobbies. 

As strings devem seguir estritamente o tom de voz determinado para o SaaS: **ausência de imperativos de pressa, validação do tempo gasto como investimento pessoal e estímulo à constância autocompassiva.** A lógica respeitará de forma absoluta o "Modo Pausa Total": se o usuário desativar os estímulos do sistema, o motor de frases será bypassado em favor do silêncio operacional técnico.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Diferencial Humano do Produto:** Fortalece o posicionamento de marca do SaaS como uma ferramenta genuína de saúde e bem-estar para neurodivergentes.
- **Isolamento de Strings:** Facilita futuras correções textuais, revisões gramaticais por especialistas ou internacionalização (i18n) das mensagens sem mexer nos controladores.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Previsibilidade Cíclica (Repetição):** Com 20 frases no total, o usuário pode começar a notar padrões repetitivos após algumas semanas de uso contínuo, reduzindo o impacto positivo do estímulo.
  *Mitigação:* Expandir periodicamente a matriz de frases no arquivo utilitário ou implementar, em sprints futuras, um resolvedor que evite repetir a mesma frase fornecida nas últimas 3 requisições.

---

## 5. Referências e Links
- Matriz e função aleatória implementadas em `src/utils/encouragement.ts`.
- Consumo e integração com regras de silenciamento avaliados no `src/controllers/hobby-controller.ts`.