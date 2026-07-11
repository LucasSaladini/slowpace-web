# 0006 - Representação Monetária em Centavos e Isolamento de Payloads de API

- **Status**: Accepted
- **Data**: 2026-07-11
- **Autores**: Lucas Saladini
- **US Relacionada**: US22, US28, Módulo Financeiro

---

## 1. Contexto e Problema
Aplicações financeiras que processam valores utilizando tipos de dados de ponto flutuante (como `float` ou `double` no JavaScript/Node.js) sofrem com imprecisões cumulativas na especificação IEEE 754 (ex: `0.1 + 0.2` resultando em `0.30000000000000004`). No ecossistema do SlowPace, inconsistências matemáticas gerariam quebras de confiança e aumento na carga cognitiva ou ansiedade dos usuários. 

Além disso, os payloads de resposta da API precisam ser previsíveis, estáveis e desacoplados das colunas físicas reais do banco de dados (evitando trafegar metadados internos da infraestrutura para o PWA).

## 2. Opções Consideradas
- **Abordagem A (Decimal/Float Nativo no Banco):** Confiar no tipo decimal nativo do banco. Exige cast complexo no ORM e mantém risco de distorção ao serializar objetos no JSON.
- **Abordagem B (Representação em Inteiros Base-100 / Centavos - Escolhida):** Multiplicar qualquer entrada monetária por `100` e arredondá-la antes de persistir, armazenando o valor estritamente como inteiro (`Int`). A conversão decimal ocorre puramente na camada de saída (View Model/Controller).

## 3. Decisão Escolhida
Adotamos a **Abordagem B**. Todos os balanços, transações e limiares financeiros no ecossistema SlowPace utilizam inteiros em centavos em nível de persistência. 

Fica determinado também que os controladores financeiros devem higienizar e mapear de forma explícita os payloads de retorno. O uso do operador spread (`...`) em listagens de banco de dados fica proibido se ele expuser de forma passiva colunas de chaves estrangeiras (`userId`) ou metadados de auditoria desnecessários para o cliente PWA.

## 4. Consequências e Trade-offs

### 👍 Pontos Positivos (Ganhos)
- **Precisão Matemática Absoluta:** Cálculos de agregados, somatórios e relatórios financeiros tornam-se operações aritméticas simples entre inteiros, imunes a falhas de ponto flutuante.
- **Economia de Armazenamento:** Colunas de inteiros possuem índices mais leves e performance de busca superior no PostgreSQL.
- **Contrato de API Limpo:** O PWA recebe os valores já formatados em formato decimal tradicional pronto para renderização.

### 👎 Pontos Negativos / Riscos (Mitigações)
- **Esquecimento de Conversão:** Risco de esquecer de dividir o valor por 100 em novas listagens, multiplicando o patrimônio ou gasto exibido ao usuário por 100 de forma errônea.
  *Mitigação:* Cobertura de testes unitários rígida e mapeamento explícito de tipos nos esquemas do Zod.

---

## 5. Referências e Links
- Lógica de persistência e tratamento implementada em `src/controllers/finance-controller.ts`.