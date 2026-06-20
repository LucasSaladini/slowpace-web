# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: finance.spec.ts >> US015 - Controle Financeiro Pessoal (Lançamentos) >> Deve barrar inputs inválidos em runtime exibindo mensagens do Zod
- Location: finance.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=O valor deve ser maior que zero')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=O valor deve ser maior que zero')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e6]: SlowPace
        - generic [ref=e7]:
          - generic [ref=e8]:
            - button [ref=e9]:
              - button [ref=e10] [cursor=pointer]:
                - img [ref=e11]
            - button [ref=e17]:
              - button [ref=e18] [cursor=pointer]:
                - img [ref=e19]
            - button [ref=e21]:
              - button [ref=e22] [cursor=pointer]:
                - img [ref=e23]
          - button "Sair da conta" [ref=e25] [cursor=pointer]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - heading "SlowPace / Cultivo" [level=1] [ref=e30]
          - generic [ref=e31]:
            - generic [ref=e32]:
              - heading "Sua Constelação" [level=2] [ref=e33]
              - generic [ref=e34]:
                - heading "Tempo Dedicado" [level=2] [ref=e35]
                - generic [ref=e36]:
                  - generic [ref=e37]: "0"
                  - generic [ref=e38]: horas
                - paragraph [ref=e39]: Sua evolução não é uma corrida, é um acúmulo de momentos significativos.
            - generic [ref=e46]: Teste
          - generic [ref=e47]:
            - heading "Seus Hábitos" [level=2] [ref=e49]
            - generic [ref=e50]:
              - generic [ref=e51]:
                - textbox "Qual novo hábito quer cultivar?" [ref=e53]
                - generic [ref=e54]:
                  - img [ref=e55]
                  - combobox [ref=e57] [cursor=pointer]:
                    - option "Diário" [selected]
                    - option "Semanal"
                    - option "Ocasional"
                - button "Adicionar" [disabled] [ref=e59] [cursor=pointer]:
                  - img [ref=e60]
                  - text: Adicionar
              - generic [ref=e61]:
                - generic [ref=e62]: Escolha a Aura
                - generic [ref=e63]:
                  - button [ref=e64] [cursor=pointer]
                  - button [ref=e65] [cursor=pointer]
                  - button [ref=e66] [cursor=pointer]
                  - button [ref=e67] [cursor=pointer]
                  - button [ref=e68] [cursor=pointer]
            - generic [ref=e70]:
              - generic [ref=e73]:
                - heading "Teste" [level=3] [ref=e74]
                - paragraph [ref=e75]: 0h 30m acumulados
              - generic [ref=e76]:
                - button "Registrar Prática" [ref=e77]:
                  - button "Registrar Prática" [ref=e78] [cursor=pointer]:
                    - img [ref=e80]
                - button "Ajustar aura" [ref=e82]:
                  - button "Ajustar aura" [ref=e83] [cursor=pointer]:
                    - img [ref=e85]
                - button "Remover luz" [ref=e88]:
                  - button "Remover luz" [ref=e89] [cursor=pointer]:
                    - img [ref=e91]
          - generic [ref=e94]:
            - heading "Fluxo Financeiro" [level=2] [ref=e96]
            - generic [ref=e97]:
              - generic [ref=e98]:
                - generic [ref=e100]: Registrar Fluxo
                - generic [ref=e102]:
                  - generic [ref=e103]:
                    - generic [ref=e104]: Tipo
                    - generic [ref=e105]:
                      - button "Despesa" [ref=e106]
                      - button "Receita" [ref=e107]
                  - generic [ref=e108]:
                    - generic [ref=e109]: Descrição
                    - textbox "Descrição" [ref=e110]:
                      - /placeholder: "Ex: Assinatura de música, feira..."
                    - paragraph [ref=e111]: A descrição precisa de pelo menos 3 caracteres
                  - generic [ref=e112]:
                    - generic [ref=e113]: Valor (R$)
                    - spinbutton "Valor (R$)" [ref=e114]
                    - paragraph [ref=e115]: Insira um valor
                  - generic [ref=e116]:
                    - generic [ref=e117]: Categoria
                    - textbox "Categoria" [ref=e118]:
                      - /placeholder: "Ex: Alimentação, Lazer..."
                    - paragraph [ref=e119]: Selecione uma categoria válida
                  - button "Confirmar" [ref=e121]
              - generic [ref=e122]:
                - generic [ref=e124]: Histórico do Fluxo
                - paragraph [ref=e126]: Seu fluxo está limpo e sem pendências.
        - complementary [ref=e127]:
          - generic [ref=e128]:
            - heading "Diário de Cultivo" [level=2] [ref=e130]
            - generic [ref=e135]:
              - generic [ref=e136]:
                - generic [ref=e137]: Teste
                - generic [ref=e138]: 19/06/2026 • 30 min
              - paragraph [ref=e139]: “Lorem Ipsum Dolor”
              - generic [ref=e140]:
                - img [ref=e141]
                - text: Reflexão do dia concluída
    - button "Modo Pausa" [ref=e145]:
      - button "Modo Pausa" [ref=e146] [cursor=pointer]:
        - img [ref=e147]
        - generic: Modo Pausa
  - region "Notifications alt+T"
  - generic [ref=e153] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e154]:
      - img [ref=e155]
    - generic [ref=e158]:
      - button "Open issues overlay" [ref=e159]:
        - generic [ref=e160]:
          - generic [ref=e161]: "1"
          - generic [ref=e162]: "2"
        - generic [ref=e163]:
          - text: Issue
          - generic [ref=e164]: s
      - button "Collapse issues badge" [ref=e165]:
        - img [ref=e166]
  - alert [ref=e168]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('US015 - Controle Financeiro Pessoal (Lançamentos)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('http://localhost:3000');
  6  |     await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
  7  |     await page.getByRole('textbox', { name: 'Senha' }).fill('123456');
  8  |     await page.click('button[type="submit"]');
  9  | 
  10 |     await expect(page).toHaveURL(/.*dashboard/);
  11 | 
  12 |     await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  13 |     await expect(page.getByRole('heading', { name: /sua constelação/i })).toBeVisible();
  14 |   });
  15 | 
  16 |   test('Deve barrar inputs inválidos em runtime exibindo mensagens do Zod', async ({ page }) => {
  17 |     const financeContainer = page.locator('form:has-text("Confirmar")');
  18 |     await expect(financeContainer).toBeVisible();
  19 | 
  20 |     await page.click('button:has-text("Confirmar")');
  21 | 
  22 |     await expect(page.locator('text=A descrição precisa de pelo menos 3 caracteres')).toBeVisible();
> 23 |     await expect(page.locator('text=O valor deve ser maior que zero')).toBeVisible();
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  24 | 
  25 |     await page.fill('input[id="description"]', 'Café da manhã');
  26 |     await page.fill('input[id="amount"]', '-5.50');
  27 |     await page.fill('input[id="category"]', 'Alimentação');
  28 | 
  29 |     await page.click('button:has-text("Confirmar")');
  30 | 
  31 |     await expect(page.locator('text=O valor deve ser maior que zero')).toBeVisible();
  32 |   });
  33 | 
  34 |   test('Deve registrar, editar e listar uma transação levemente', async ({ page }) => {
  35 |     await page.fill('input[id="description"]', 'Livro de Arquitetura');
  36 |     await page.fill('input[id="amount"]', '89.90');
  37 |     await page.fill('input[id="category"]', 'Educação');
  38 |     await page.click('button:has-text("Confirmar")');
  39 | 
  40 |     await expect(page.locator('text=Lançamento registrado de forma leve.')).toBeVisible();
  41 |     await expect(page.locator('text=Livro de Arquitetura')).toBeVisible();
  42 | 
  43 |     await page.locator('div[key] >> text=Livro de Arquitetura').hover();
  44 |     await page.click('button:has-text("Editar")');
  45 |     
  46 |     await page.fill('input[id="description"]', 'Livro de Arquitetura Clean');
  47 |     await page.click('button:has-text("Salvar Alteração")');
  48 | 
  49 |     await expect(page.locator('text=Lançamento ajustado com sucesso.')).toBeVisible();
  50 |     await expect(page.locator('text=Livro de Arquitetura Clean')).toBeVisible();
  51 |   });
  52 | });
  53 | 
  54 | test.describe('US015 - Segurança e Isolamento Lógico (Pentest/BOLA)', () => {
  55 | 
  56 |   test('Não deve permitir que o Usuário B manipule ou veja transações do Usuário A (BOLA)', async ({ request }) => {
  57 |     const loginResponse = await request.post('/api/auth/login', {
  58 |       data: { email: 'usuario.b@lumeapp.com', password: 'SenhaSegura456' }
  59 |     });
  60 |     const { token: tokenB } = await loginResponse.json();
  61 | 
  62 |     const transactionIdUserA = 'b89c3a1d-72ee-488f-9d32-84196196a67f';
  63 | 
  64 |     const deleteAttempt = await request.delete(`/api/finance/transactions/${transactionIdUserA}`, {
  65 |       headers: { 'Authorization': `Bearer ${tokenB}` }
  66 |     });
  67 | 
  68 |     expect(deleteAttempt.status()).toBe(404);
  69 | 
  70 |     const updateAttempt = await request.put(`/api/finance/transactions/${transactionIdUserA}`, {
  71 |       headers: { 'Authorization': `Bearer ${tokenB}` },
  72 |       data: {
  73 |         description: 'Ataque de Alteração',
  74 |         amount: 10,
  75 |         type: 'INCOME',
  76 |         category: 'Invasão'
  77 |       }
  78 |     });
  79 | 
  80 |     expect(updateAttempt.status()).toBe(404);
  81 |   });
  82 | });
```