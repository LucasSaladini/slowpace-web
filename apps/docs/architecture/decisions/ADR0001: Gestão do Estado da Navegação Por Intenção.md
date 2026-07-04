# ADR 0001: Gestão de Estado da Navegação por Intenção
Status: Accepted

Contexto: Precisamos de uma forma de alternar entre Presença, Foco e Fluxo que seja rápida (client-side), suporte animações fluidas e permita que cada estado tenha sua própria interface sem sobrecarregar o DOM.

Decisão: Utilizaremos um Zustand Store para o estado global do "Mood" atual e Framer Motion para as transições de layout e o indicador orgânico. A renderização será condicional para garantir performance e acessibilidade (desmontagem de componentes inativos).

Consequências: Navegação instantânea, histórico de rota limpo (inicialmente sem mudar URL para evitar flickers de carregamento), mas exige cuidado com o estado de scroll ao alternar.